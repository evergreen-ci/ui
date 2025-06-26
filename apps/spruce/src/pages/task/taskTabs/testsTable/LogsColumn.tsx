import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { size } from "@evg-ui/lib/constants/tokens";
import { TestStatus } from "@evg-ui/lib/types/test";
import { useTaskAnalytics } from "analytics";
import { getTaskRoute } from "constants/routes";
import { TestResult, TaskQuery } from "gql/generated/types";
import { TaskTab } from "types/task";
import { string } from "utils";
import { TaskHistoryOptions } from "../TaskHistory/types";
import { TaskHistoryTestsButton } from "./logsColumn/TaskHistoryTestsButton";

const { escapeRegex } = string;
interface Props {
  testResult: TestResult;
  task: TaskQuery["task"];
}

export const LogsColumn: React.FC<Props> = ({ task, testResult }) => {
  const { status, testFile } = testResult;
  const { url: urlHTML, urlParsley, urlRaw } = testResult.logs ?? {};
  const { displayTask, id: taskId } = task ?? {};
  const { sendEvent } = useTaskAnalytics();
  const filters = status === TestStatus.Fail ? escapeRegex(testFile) : null;
  const isExecutionTask = displayTask !== null;
  return (
    <ButtonWrapper>
      {urlParsley && (
        <Button
          data-cy="test-table-parsley-btn"
          href={urlParsley}
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
      {urlHTML && (
        <Button
          data-cy="test-table-html-btn"
          href={urlHTML}
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
