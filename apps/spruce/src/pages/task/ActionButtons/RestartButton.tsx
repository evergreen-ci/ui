import { useMutation } from "@apollo/client";
import { Menu, MenuItem } from "@leafygreen-ui/menu";
import { Tooltip, Align, Justify } from "@leafygreen-ui/tooltip";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { useQueryParam } from "@evg-ui/lib/hooks";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { useTaskAnalytics } from "analytics";
import { LoadingButton, Size as ButtonSize } from "components/Buttons";
import { Requester } from "constants/requesters";
import {
  RestartTaskMutation,
  RestartTaskMutationVariables,
  TaskQuery,
} from "gql/generated/types";
import { RESTART_TASK } from "gql/mutations";

interface Props {
  isDisplayTask: boolean;
  task: NonNullable<TaskQuery["task"]>;
}

export const RestartButton: React.FC<Props> = ({ isDisplayTask, task }) => {
  const { canRestart, executionTasksFull, id: taskId, requester } = task || {};

  const allExecutionTasksSucceeded =
    executionTasksFull?.every(
      (t) => t.displayStatus === TaskStatus.Succeeded,
    ) ?? false;

  const dispatchToast = useToastContext();

  const taskAnalytics = useTaskAnalytics();
  const [, setExecution] = useQueryParam("execution", 0);

  const [restartTask, { loading: loadingRestartTask }] = useMutation<
    RestartTaskMutation,
    RestartTaskMutationVariables
  >(RESTART_TASK, {
    onCompleted: (data) => {
      const { latestExecution, priority } = data.restartTask ?? {};
      if ((priority || 0) < 0) {
        dispatchToast.warning(
          "Task scheduled to restart, but is disabled. Enable the task to run.",
        );
      } else {
        dispatchToast.success("Task scheduled to restart");
      }
      setExecution(latestExecution);
    },
    onError: (err) => {
      dispatchToast.error(`Error restarting task: ${err.message}`);
    },
  });

  const isMergeQueuePatch = requester === Requester.GitHubMergeQueue;
  const isMenuButton = isDisplayTask && !allExecutionTasksSucceeded;
  const disabled = loadingRestartTask || !canRestart || isMergeQueuePatch;
  const message = isMergeQueuePatch
    ? "GitHub merge queue tasks cannot be restarted."
    : "This task is not restartable.";

  return (
    <Tooltip
      align={Align.Top}
      enabled={disabled}
      justify={Justify.Middle}
      trigger={
        isMenuButton ? (
          <Menu
            trigger={
              <LoadingButton
                data-cy="restart-task"
                disabled={disabled}
                loading={loadingRestartTask}
                size={ButtonSize.Small}
              >
                Restart
              </LoadingButton>
            }
          >
            <MenuItem
              onClick={() => {
                restartTask({ variables: { taskId, failedOnly: false } });
                taskAnalytics.sendEvent({
                  name: "Clicked restart task button",
                  allTasks: true,
                  "task.is_display_task": true,
                });
              }}
            >
              Restart all tasks
            </MenuItem>
            <MenuItem
              onClick={() => {
                restartTask({ variables: { taskId, failedOnly: true } });
                taskAnalytics.sendEvent({
                  name: "Clicked restart task button",
                  allTasks: false,
                  "task.is_display_task": true,
                });
              }}
            >
              Restart unsuccessful tasks
            </MenuItem>
          </Menu>
        ) : (
          <LoadingButton
            key="restart"
            data-cy="restart-task"
            disabled={disabled}
            loading={loadingRestartTask}
            onClick={() => {
              restartTask({ variables: { taskId, failedOnly: false } });
              taskAnalytics.sendEvent({
                name: "Clicked restart task button",
                "task.is_display_task": false,
              });
            }}
            size={ButtonSize.Small}
          >
            Restart
          </LoadingButton>
        )
      }
    >
      {message}
    </Tooltip>
  );
};
