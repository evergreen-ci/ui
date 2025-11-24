import styled from "@emotion/styled";
import { Button } from "@leafygreen-ui/button";
import { size } from "@evg-ui/lib/constants/tokens";
import { TestStatus } from "@evg-ui/lib/types/test";
import { toEscapedRegex } from "@evg-ui/lib/utils/string";
import { useTaskAnalytics } from "analytics";
import { getTaskRoute, getTestHTMLLogRoute } from "constants/routes";
import { TestResult, TaskQuery } from "gql/generated/types";
import { useConditionallyLinkToParsleyBeta } from "hooks/useConditionallyLinkToParsleyBeta";
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
  const filters = status === TestStatus.Fail ? toEscapedRegex(testFile) : null;
  const isExecutionTask = displayTask !== null;

  const { replaceUrl } = useConditionallyLinkToParsleyBeta();

  const execution = testExecution ?? taskExecution ?? 0;
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
      {urlParsley && (
        <Button
          data-cy="test-table-parsley-btn"
          href={replaceUrl(urlParsley)}
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
          data-cy="test-table-html-btn"
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
      {urlRaw && (
        <Button
          data-cy="test-table-raw-btn"
          href={urlRaw}
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
