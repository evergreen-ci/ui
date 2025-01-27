import { useState } from "react";
import Button from "@leafygreen-ui/button";
import Tooltip from "@leafygreen-ui/tooltip";
import { usePreferencesAnalytics } from "analytics";
import Icon from "components/Icon";
import { QueryParams } from "constants/queryParams";
import { useLogContext } from "context/LogContext";
import { useQueryParam } from "hooks/useQueryParam";
import { SentryBreadcrumb, leaveBreadcrumb } from "utils/errorReporting";
import { copyToClipboard, getJiraFormat } from "utils/string";
import { DetailRow } from "../styles";

const ButtonRow: React.FC = () => {
  const { sendEvent } = usePreferencesAnalytics();
  const { getLine, logMetadata } = useLogContext();

  const [hasCopied, setHasCopied] = useState(false);
  const [bookmarks] = useQueryParam<number[]>(QueryParams.Bookmarks, []);

  const { htmlLogURL, jobLogsURL, rawLogURL } = logMetadata || {};
  const tooltipText = bookmarks.length
    ? "Copy bookmarked lines in JIRA format"
    : "No bookmarks to copy.";

  return (
    <DetailRow>
      <Tooltip
        align="top"
        justify="middle"
        trigger={
          <Button
            data-cy="jira-button"
            disabled={!bookmarks.length}
            leftGlyph={<Icon glyph="Copy" />}
            onClick={async () => {
              leaveBreadcrumb(
                "copy-jira",
                { bookmarks },
                SentryBreadcrumb.User,
              );
              await copyToClipboard(getJiraFormat(bookmarks, getLine));
              setHasCopied(!hasCopied);
              sendEvent({ name: "Clicked copy to Jira format button" });
            }}
          >
            JIRA
          </Button>
        }
        triggerEvent="hover"
      >
        {hasCopied ? "Copied!" : tooltipText}
      </Tooltip>
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
    </DetailRow>
  );
};

export default ButtonRow;
