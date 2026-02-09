import { useEffect } from "react";
import styled from "@emotion/styled";
import { Body } from "@leafygreen-ui/typography";
import { useParams } from "react-router-dom";
import { Icon } from "@evg-ui/lib/components";
import { fontSize, size } from "@evg-ui/lib/constants";
import { useToastContext } from "@evg-ui/lib/context";
import { SentryBreadcrumbTypes, leaveBreadcrumb } from "@evg-ui/lib/utils";
import LoadingBar from "components/LoadingBar";
import { LogTypes } from "constants/enums";
import { getResmokeLogURL } from "constants/logURLTemplates";
import { slugs } from "constants/routes";
import { useLogContext } from "context/LogContext";
import { useLogDownloader } from "hooks";
import { useFetch } from "hooks/useFetch";
import NotFound from "pages/404";
import { LogkeeperMetadata } from "types/api";
import { getBytesAsString } from "utils/string";
import { useResolveLogURLAndRenderingType } from "./useResolveLogURLAndRenderingType";

interface LoadingPageProps {
  logType: LogTypes;
}

const LoadingPage: React.FC<LoadingPageProps> = ({ logType }) => {
  const {
    [slugs.buildID]: buildID,
    [slugs.execution]: execution,
    [slugs.fileName]: fileName,
    [slugs.groupID]: groupID,
    [slugs.origin]: origin,
    [slugs.testID]: testID,
    [slugs.taskID]: taskID,
  } = useParams();
  const dispatchToast = useToastContext();
  const { ingestLines, setLogMetadata } = useLogContext();
  const {
    downloadURL,
    failingCommand,
    htmlLogURL,
    jobLogsURL,
    loading: isLoadingEvergreen,
    rawLogURL,
    renderingType,
  } = useResolveLogURLAndRenderingType({
    buildID,
    execution,
    fileName,
    groupID,
    logType,
    origin,
    taskID,
    testID,
  });
  const { data: logkeeperMetadata, isLoading: isLoadingLogkeeperMetadata } =
    useFetch<LogkeeperMetadata>(
      getResmokeLogURL(buildID || "", { metadata: true, testID }),
      {
        skip: logType !== LogTypes.LOGKEEPER_LOGS || buildID === undefined,
      },
    );

  const {
    data,
    error,
    fileSize,
    isLoading: isLoadingLog,
  } = useLogDownloader({
    logType,
    url: downloadURL,
  });

  useEffect(() => {
    if (data && !isLoadingLogkeeperMetadata) {
      leaveBreadcrumb(
        "ingest-log-lines",
        { logType },
        SentryBreadcrumbTypes.UI,
      );
      setLogMetadata({
        buildID,
        execution: execution || String(logkeeperMetadata?.execution || 0),
        fileName,
        groupID,
        htmlLogURL,
        jobLogsURL,
        logType,
        origin,
        rawLogURL,
        renderingType,
        taskID: taskID || logkeeperMetadata?.task_id,
        testID,
      });
      ingestLines(data, renderingType, failingCommand);
    }
    if (error) {
      dispatchToast.error(error);
    }
  }, [
    buildID,
    data,
    dispatchToast,
    error,
    execution,
    fileName,
    groupID,
    htmlLogURL,
    ingestLines,
    isLoadingLogkeeperMetadata,
    jobLogsURL,
    logkeeperMetadata?.execution,
    logkeeperMetadata?.task_id,
    logType,
    origin,
    rawLogURL,
    renderingType,
    setLogMetadata,
    taskID,
    testID,
    failingCommand,
  ]);

  if (isLoadingLog || isLoadingEvergreen) {
    return (
      <Container>
        <LoadingBarContainer>
          <FlexRow>
            <LogoContainer>
              <AnimationWrapper>
                {/* @ts-expect-error: useStroke is not recognized as a valid prop */}
                <Icon glyph="ParsleyLogo" size={36} useStroke />
              </AnimationWrapper>
              <StyledBody>Downloading log...</StyledBody>
            </LogoContainer>
            <DownloadSize>{getBytesAsString(fileSize)}</DownloadSize>
          </FlexRow>
          <LoadingBar indeterminate />
        </LoadingBarContainer>
      </Container>
    );
  }
  if (error) {
    return (
      <Container>
        <NotFound />
      </Container>
    );
  }
  return null;
};

const LoadingBarContainer = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  width: 40%;
  gap: ${size.s};
`;

const LogoContainer = styled.div`
  display: flex;
  gap: ${size.s};
  align-items: flex-end;
`;

const FlexRow = styled.div`
  display: flex;
  align-items: flex-end;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

const DownloadSize = styled.div`
  font-family: "Source Code Pro", monospace;
`;

const AnimationWrapper = styled.div`
  animation: sway 3s infinite ease-in-out;
  transform-origin: bottom;
  @keyframes sway {
    0% {
      transform: rotateZ(0deg);
    }
    25% {
      transform: rotateZ(-5deg);
    }
    50% {
      transform: rotateZ(5deg);
    }
    75% {
      transform: rotateZ(-5deg);
    }
    100% {
      transform: rotateZ(0deg);
    }
  }
`;

const StyledBody = styled(Body)`
  font-size: ${fontSize.l};
`;

const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
`;

export default LoadingPage;
