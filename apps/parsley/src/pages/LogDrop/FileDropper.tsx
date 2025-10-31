import { useCallback, useTransition } from "react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { FileRejection, useDropzone } from "react-dropzone";
import { size } from "@evg-ui/lib/constants/tokens";
import { useToastContext } from "@evg-ui/lib/context/toast";
import {
  SentryBreadcrumbTypes,
  leaveBreadcrumb,
  reportError,
} from "@evg-ui/lib/utils/errorReporting";
import { decodeStream } from "@evg-ui/lib/utils/streams";
import { useLogDropAnalytics } from "analytics";
import { LogRenderingTypes, LogTypes } from "constants/enums";
import { LOG_LINE_TOO_LARGE_WARNING } from "constants/errors";
import { LOG_FILE_SIZE_LIMIT, LOG_LINE_SIZE_LIMIT } from "constants/logs";
import { useLogContext } from "context/LogContext";
import useClipboardPaste from "hooks/useClipboardPaste";
import { fileToStream } from "utils/file";
import { LogDropType } from "./constants";
import FileSelector from "./FileSelector";
import LoadingAnimation from "./LoadingAnimation";
import ParseLogSelect from "./ParseLogSelect";
import useLogDropState from "./state";

const { green } = palette;

const FileDropper: React.FC = () => {
  const dispatchToast = useToastContext();
  const { sendEvent } = useLogDropAnalytics();
  const { ingestLines, setFileName, setLogMetadata } = useLogContext();
  const [, startTransition] = useTransition();
  const { dispatch, state } = useLogDropState();

  const onDropAccepted = useCallback(
    (acceptedFiles: File[]) => {
      leaveBreadcrumb("Dropped file", {}, SentryBreadcrumbTypes.User);
      sendEvent({ name: "Used file dropper to upload file" });
      dispatch({ file: acceptedFiles[0], type: "DROPPED_FILE" });
    },
    [dispatch, sendEvent],
  );

  const onDropRejected = useCallback(
    (fileRejections: FileRejection[]) => {
      dispatch({ type: "CANCEL" });
      const uploadErrors = new Set(
        fileRejections.flatMap(({ errors }) =>
          errors.map(({ message }) => message),
        ),
      );
      dispatchToast.error(
        `Log could not be uploaded: ${Array.from(uploadErrors).join(", ")}`,
      );
    },
    [dispatch, dispatchToast],
  );

  const onClipboardPaste = useCallback(
    (text: string) => {
      leaveBreadcrumb("Pasted text", {}, SentryBreadcrumbTypes.User);
      sendEvent({ name: "Used clipboard paste to upload log file" });
      dispatch({ text, type: "PASTED_TEXT" });
    },
    [dispatch, sendEvent],
  );

  useClipboardPaste(onClipboardPaste);

  const onParse = useCallback(
    (renderingType: LogRenderingTypes | undefined) => {
      if (renderingType) {
        const logType = LogTypes.LOCAL_UPLOAD;
        setLogMetadata({
          logType,
          renderingType,
        });
        leaveBreadcrumb("Parsing file", { logType }, SentryBreadcrumbTypes.UI);
        dispatch({ type: "PARSE_FILE" });
        startTransition(() => {
          (async () => {
            switch (state.type) {
              case LogDropType.FILE: {
                if (state.file) {
                  try {
                    const stream = await fileToStream(state.file, {
                      fileSizeLimit: LOG_FILE_SIZE_LIMIT,
                    });
                    const { result: logLines, trimmedLines } =
                      await decodeStream(stream, LOG_LINE_SIZE_LIMIT);
                    leaveBreadcrumb(
                      "Decoded file",
                      { fileSize: logLines.length },
                      SentryBreadcrumbTypes.UI,
                    );
                    sendEvent({
                      "file.size": logLines?.length,
                      "log.type": logType,
                      name: "System Event processed uploaded log file",
                    });
                    setFileName(state.file.name);
                    ingestLines(logLines, renderingType);
                    if (trimmedLines) {
                      dispatchToast.warning(LOG_LINE_TOO_LARGE_WARNING, true, {
                        shouldTimeout: false,
                        title: "Log not fully loaded",
                      });
                    }
                  } catch (e: any) {
                    dispatchToast.error(
                      "An error occurred while parsing the log.",
                    );
                    reportError(e).severe();
                  }
                }
                break;
              }
              case LogDropType.TEXT: {
                if (state.text) {
                  const logLines = state.text.split("\n");
                  setFileName("Pasted Text");
                  ingestLines(logLines, renderingType);
                }
                break;
              }
              default: {
                reportError(
                  new Error(`Invalid state type: ${state.type}`),
                ).severe();
                break;
              }
            }
          })();
        });
      }
    },
    [
      startTransition,
      setLogMetadata,
      dispatch,
      state.file,
      state.type,
      state.text,
      sendEvent,
      setFileName,
      ingestLines,
      dispatchToast,
    ],
  );

  const { getInputProps, getRootProps, open } = useDropzone({
    maxFiles: 1,
    multiple: false,
    noClick: true,
    noKeyboard: true,
    onDropAccepted,
    onDropRejected,
  });

  let visibleUI = null;

  switch (state.currentState) {
    case "WAITING_FOR_FILE":
      visibleUI = <FileSelector getInputProps={getInputProps} open={open} />;
      break;
    case "PROMPT_FOR_PARSING_METHOD":
      visibleUI = (
        <ParseLogSelect
          fileName={state.type === "file" ? state.file?.name : "Pasted Text"}
          onCancel={() => dispatch({ type: "CANCEL" })}
          onParse={onParse}
        />
      );
      break;
    case "LOADING_FILE":
      visibleUI = <LoadingAnimation />;
      break;
    default:
      visibleUI = null;
      break;
  }

  return (
    <Container>
      <BorderBox>
        <Dropzone {...getRootProps()} data-cy="upload-zone">
          {visibleUI}
        </Dropzone>
      </BorderBox>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const BorderBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: ${size.xxs} dashed ${green.base};
  border-radius: ${size.s};
  padding: ${size.s};
`;

const Dropzone = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${size.xl};
  width: 50vw;
  height: 30vh;
  min-height: fit-content;
`;

export default FileDropper;
