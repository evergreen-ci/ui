import styled from "@emotion/styled";
import { Button } from "@leafygreen-ui/button";
import { size } from "@evg-ui/lib/constants/tokens";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { TestStatus } from "@evg-ui/lib/types/test";
import { downloadFile } from "@evg-ui/lib/utils/request";
import { toEscapedRegex } from "@evg-ui/lib/utils/string";
import { isValidHttpUrl } from "@evg-ui/lib/utils/url";
import { useTaskAnalytics } from "analytics";
import { getTaskRoute, getTestHTMLLogRoute } from "constants/routes";
import { TaskQuery, TestResult } from "gql/generated/types";
import { TaskTab } from "types/task";
import { TaskHistoryOptions } from "../TaskHistory/types";
import { TaskHistoryTestsButton } from "./logsColumn/TaskHistoryTestsButton";

interface Props {
  testResult: TestResult;
  task: TaskQuery["task"];
}

export const LogsColumn: React.FC<Props> = ({ task, testResult }) => {
  const { execution: testExecution, groupID, status, testFile } = testResult;
  const { lineNum, testName, urlParsley, urlRaw } = testResult.logs ?? {};
  const { displayTask, execution: taskExecution, id: taskId } = task ?? {};
  const { sendEvent } = useTaskAnalytics();
  const { success } = useToastContext();
  const filters = status === TestStatus.Fail ? toEscapedRegex(testFile) : null;
  const isExecutionTask = displayTask !== null;

  const execution = testExecution ?? taskExecution ?? 0;
  const safeUrlParsley = isValidHttpUrl(urlParsley) ? urlParsley : null;
  const safeUrlRaw = isValidHttpUrl(urlRaw) ? urlRaw : null;
  const testHTMLLogRoute =
    taskId && testName
      ? getTestHTMLLogRoute(
          taskId,
          execution,
          testName,
          groupID || undefined,
          lineNum ?? undefined,
        )
      : null;

  return (
    <ButtonWrapper>
      {safeUrlParsley && (
        <Button
          data-testid="test-table-parsley-btn"
          href={safeUrlParsley}
          onClick={() =>
            sendEvent({
              name: "Clicked test log link",
              "log.viewer": "parsley",
              "test.status": status,
            })
          }
          size="xsmall"
          title="High-powered log viewer"
        >
          Parsley
        </Button>
      )}
      {testHTMLLogRoute && (
        <Button
          data-testid="test-table-html-btn"
          href={testHTMLLogRoute}
          onClick={() =>
            sendEvent({
              name: "Clicked test log link",
              "log.viewer": "html",
              "test.status": status,
            })
          }
          size="xsmall"
          title="Plain, colorized log viewer"
        >
          HTML
        </Button>
      )}
      {safeUrlRaw && (
        <Button
          data-testid="test-table-raw-btn"
          href={safeUrlRaw}
          onClick={() =>
            sendEvent({
              name: "Clicked test log link",
              "log.viewer": "raw",
              "test.status": status,
            })
          }
          size="xsmall"
          title="Plain text log viewer"
        >
          Raw
        </Button>
      )}
      {safeUrlRaw && (
        <Button
          data-testid="test-table-download-btn"
          onClick={() => {
            const sanitized = testFile.replace(/[^a-zA-Z0-9._-]/g, "_");
            downloadFile(safeUrlRaw, `${taskId}_${sanitized}.log`, () => {
              success("Log downloaded started");
            });
            sendEvent({
              name: "Clicked test log link",
              "log.viewer": "download",
              "test.status": status,
            });
          }}
          size="xsmall"
        >
          Download
        </Button>
      )}
      {taskId && filters && !isExecutionTask && (
        <TaskHistoryTestsButton
          onClick={() => {
            sendEvent({ name: "Clicked see history link" });
          }}
          to={getTaskRoute(taskId, {
            tab: TaskTab.History,
            [TaskHistoryOptions.FailingTest]: filters,
          })}
        />
      )}
    </ButtonWrapper>
  );
};

const ButtonWrapper = styled.div`
  > * {
    margin-right: ${size.xs};
    margin-top: ${size.xs};
  }
`;
