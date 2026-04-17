import { Button } from "@leafygreen-ui/button";
import { Tooltip } from "@leafygreen-ui/tooltip";
import Icon from "@evg-ui/lib/components/Icon";
import { downloadFile } from "@evg-ui/lib/utils/request";
import { usePreferencesAnalytics } from "analytics";
import { useLogContext } from "context/LogContext";
import { DetailRow } from "../styles";
import { CopyTextButton } from "./CopyTextButton";

const ButtonRow: React.FC = () => {
  const { sendEvent } = usePreferencesAnalytics();
  const { logMetadata } = useLogContext();

  const { htmlLogURL, jobLogsURL, rawLogURL } = logMetadata || {};

  return (
    <DetailRow>
      <CopyTextButton />
      <Tooltip
        align="top"
        justify="middle"
        trigger={
          <Button
            data-cy="job-logs-button"
            disabled={!jobLogsURL}
            href={jobLogsURL}
            leftGlyph={<Icon glyph="Export" />}
            onClick={() => sendEvent({ name: "Clicked job logs link" })}
          >
            Job logs
          </Button>
        }
      >
        View all logs for this job
      </Tooltip>
      <Tooltip
        align="top"
        justify="middle"
        trigger={
          <Button
            data-cy="raw-log-button"
            disabled={!rawLogURL}
            href={rawLogURL}
            leftGlyph={<Icon glyph="Export" />}
            onClick={() => sendEvent({ name: "Clicked raw logs link" })}
          >
            Raw
          </Button>
        }
      >
        Open Raw log in a new tab
      </Tooltip>
      <Tooltip
        align="top"
        justify="middle"
        trigger={
          <Button
            data-cy="html-log-button"
            disabled={!htmlLogURL}
            href={htmlLogURL}
            leftGlyph={<Icon glyph="Export" />}
            onClick={() => sendEvent({ name: "Clicked HTML logs link" })}
          >
            HTML
          </Button>
        }
      >
        Open log in standard HTML format in a new tab
      </Tooltip>
      <Tooltip
        align="top"
        justify="middle"
        trigger={
          <Button
            data-cy="download-log-button"
            disabled={!rawLogURL}
            leftGlyph={<Icon glyph="Export" />}
            onClick={() => {
              if (rawLogURL) {
                downloadFile(rawLogURL);
                sendEvent({ name: "Clicked download logs link" });
              }
            }}
          >
            Download
          </Button>
        }
      >
        Download log as a file
      </Tooltip>
    </DetailRow>
  );
};

export default ButtonRow;
