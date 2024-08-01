import { useState } from "react";
import { useMutation } from "@apollo/client";
import Button from "@leafygreen-ui/button";
import { Menu, MenuItem } from "@leafygreen-ui/menu";
import { useParams } from "react-router-dom";
import { useTaskAnalytics } from "analytics";
import { DropdownItem, ButtonDropdown } from "components/ButtonDropdown";
import { LoadingButton } from "components/Buttons";
import SetPriority from "components/SetPriority";
import { PageButtonRow } from "components/styles";
import { commitQueueRequester } from "constants/requesters";
import { getTaskHistoryRoute, slugs } from "constants/routes";
import { mergeTaskName } from "constants/task";
import { useToastContext } from "context/toast";
import {
  SetTaskPriorityMutation,
  SetTaskPriorityMutationVariables,
  AbortTaskMutation,
  AbortTaskMutationVariables,
  RestartTaskMutation,
  RestartTaskMutationVariables,
  ScheduleTasksMutation,
  ScheduleTasksMutationVariables,
  UnscheduleTaskMutation,
  UnscheduleTaskMutationVariables,
  OverrideTaskDependenciesMutation,
  OverrideTaskDependenciesMutationVariables,
  TaskQuery,
} from "gql/generated/types";
import {
  ABORT_TASK,
  OVERRIDE_TASK_DEPENDENCIES,
  RESTART_TASK,
  SCHEDULE_TASKS,
  SET_TASK_PRIORITY,
  UNSCHEDULE_TASK,
} from "gql/mutations";
import { useLGButtonRouterLink } from "hooks/useLGButtonRouterLink";
import { useQueryParam } from "hooks/useQueryParam";
import { TaskStatus } from "types/task";
import { RelevantCommits } from "./actionButtons/RelevantCommits";
import { TaskNotificationModal } from "./actionButtons/TaskNotificationModal";

interface Props {
  initialPriority?: number;
  isDisplayTask: boolean;
  isExecutionTask: boolean;
  task: TaskQuery["task"];
}

export const ActionButtons: React.FC<Props> = ({
  initialPriority = 1,
  isDisplayTask,
  isExecutionTask,
  task,
}) => {
  const {
    buildVariant,
    canAbort,
    canDisable,
    canOverrideDependencies,
    canRestart,
    canSchedule,
    canSetPriority,
    canUnschedule,
    displayName,
    executionTasksFull,
    project,
    requester,
    versionMetadata,
  } = task || {};

  const { id: versionId, isPatch, order } = versionMetadata || {};
  const { identifier: projectIdentifier } = project || {};
  const isPatchOnCommitQueue = requester === commitQueueRequester;
  const allExecutionTasksSucceeded =
    executionTasksFull?.every((t) => t.status === TaskStatus.Succeeded) ??
    false;

  const dispatchToast = useToastContext();
  const [isVisibleModal, setIsVisibleModal] = useState(false);

  const { [slugs.taskId]: taskId } = useParams();
  const taskAnalytics = useTaskAnalytics();
  const [, setExecution] = useQueryParam("execution", 0);

  const [scheduleTask, { loading: loadingScheduleTask }] = useMutation<
    ScheduleTasksMutation,
    ScheduleTasksMutationVariables
  >(SCHEDULE_TASKS, {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    variables: { taskIds: [taskId], versionId },
    onCompleted: () => {
      dispatchToast.success("Task marked as scheduled");
    },
    onError: (err) => {
      dispatchToast.error(`Error scheduling task: ${err.message}`);
    },
  });

  const [unscheduleTask, { loading: loadingUnscheduleTask }] = useMutation<
    UnscheduleTaskMutation,
    UnscheduleTaskMutationVariables
  >(UNSCHEDULE_TASK, {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    variables: { taskId },
    onCompleted: () => {
      dispatchToast.success("Task marked as unscheduled");
    },
    onError: (err) => {
      dispatchToast.error(`Error unscheduling task: ${err.message}`);
    },
  });

  const [abortTask, { loading: loadingAbortTask }] = useMutation<
    AbortTaskMutation,
    AbortTaskMutationVariables
  >(ABORT_TASK, {
    variables: {
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      taskId,
    },
    onCompleted: () => {
      dispatchToast.success("Task aborted");
    },
    onError: (err) => {
      dispatchToast.error(`Error aborting task: ${err.message}`);
    },
  });

  const [restartTask, { loading: loadingRestartTask }] = useMutation<
    RestartTaskMutation,
    RestartTaskMutationVariables
  >(RESTART_TASK, {
    onCompleted: (data) => {
      const { latestExecution, priority } = data.restartTask;
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      if (priority < 0) {
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

  const [setTaskPriority, { loading: loadingSetPriority }] = useMutation<
    SetTaskPriorityMutation,
    SetTaskPriorityMutationVariables
  >(SET_TASK_PRIORITY, {
    onCompleted: (data) => {
      dispatchToast.success(
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        data.setTaskPriority.priority >= 0
          ? `Priority for task updated to ${data.setTaskPriority.priority}`
          : `Task was successfully disabled`,
      );
    },
    onError: (err) => {
      dispatchToast.error(`Error updating priority for task: ${err.message}`);
    },
  });

  const [
    overrideTaskDependencies,
    { loading: loadingOverrideTaskDependencies },
  ] = useMutation<
    OverrideTaskDependenciesMutation,
    OverrideTaskDependenciesMutationVariables
  >(OVERRIDE_TASK_DEPENDENCIES, {
    onCompleted: () => {
      dispatchToast.success("Successfully overrode task dependencies");
    },
    onError: (err) => {
      dispatchToast.error(`Error overriding task dependencies: ${err.message}`);
    },
  });

  const HistoryLink = useLGButtonRouterLink(
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    getTaskHistoryRoute(projectIdentifier, displayName, {
      selectedCommit: !isPatch && order,
      visibleColumns: [buildVariant],
    }),
  );

  const disabled =
    loadingAbortTask ||
    loadingRestartTask ||
    loadingSetPriority ||
    loadingUnscheduleTask ||
    loadingScheduleTask ||
    loadingOverrideTaskDependencies;

  const dropdownItems = [
    <DropdownItem
      key="unschedule"
      disabled={disabled || !canUnschedule}
      data-cy="unschedule-task"
      onClick={() => {
        unscheduleTask();
        taskAnalytics.sendEvent({ name: "Clicked unschedule task button" });
      }}
    >
      Unschedule
    </DropdownItem>,
    <DropdownItem
      key="abort"
      data-cy="abort-task"
      disabled={disabled || !canAbort}
      onClick={() => {
        abortTask();
        taskAnalytics.sendEvent({ name: "Clicked abort task button" });
      }}
    >
      Abort
    </DropdownItem>,
    <DropdownItem
      key="disable-task"
      data-cy="disable-enable"
      disabled={disabled || !canDisable}
      onClick={() => {
        setTaskPriority({
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          variables: { taskId, priority: initialPriority < 0 ? 0 : -1 },
        });
      }}
      title={
        initialPriority < 0
          ? ""
          : "Disabling a task prevents it from being run unless explicitly activated by a user."
      }
    >
      {initialPriority < 0 ? "Enable" : "Disable"}
    </DropdownItem>,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    <SetPriority
      key="set-task-priority"
      taskId={taskId}
      disabled={disabled || !canSetPriority}
      initialPriority={initialPriority}
    />,
    <DropdownItem
      key="override-dependencies"
      data-cy="override-dependencies"
      disabled={disabled || !canOverrideDependencies}
      onClick={() => {
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        overrideTaskDependencies({ variables: { taskId } });
      }}
    >
      Override Dependencies
    </DropdownItem>,
  ];

  return (
    <>
      <PageButtonRow>
        {!isExecutionTask && (
          <>
            <RelevantCommits task={task} />
            <Button
              size="small"
              data-cy="task-history"
              key="task-history"
              onClick={() => {
                taskAnalytics.sendEvent({ name: "Clicked see history link" });
              }}
              as={HistoryLink}
              disabled={displayName === mergeTaskName}
            >
              See history
            </Button>
          </>
        )}
        <LoadingButton
          size="small"
          data-cy="schedule-task"
          key="schedule"
          disabled={disabled || !canSchedule || isPatchOnCommitQueue}
          loading={loadingScheduleTask}
          onClick={() => {
            scheduleTask();
            taskAnalytics.sendEvent({ name: "Clicked schedule task button" });
          }}
        >
          Schedule
        </LoadingButton>
        {isDisplayTask && !allExecutionTasksSucceeded ? (
          <Menu
            trigger={
              <LoadingButton
                size="small"
                data-cy="restart-task"
                disabled={disabled || !canRestart || isPatchOnCommitQueue}
                loading={loadingRestartTask}
              >
                Restart
              </LoadingButton>
            }
          >
            <MenuItem
              onClick={() => {
                // @ts-expect-error: FIXME. This comment was added by an automated script.
                restartTask({ variables: { taskId, failedOnly: false } });
                taskAnalytics.sendEvent({
                  name: "Clicked restart task button",
                  allTasks: true,
                  isDisplayTask: true,
                });
              }}
            >
              Restart all tasks
            </MenuItem>
            <MenuItem
              onClick={() => {
                // @ts-expect-error: FIXME. This comment was added by an automated script.
                restartTask({ variables: { taskId, failedOnly: true } });
                taskAnalytics.sendEvent({
                  name: "Clicked restart task button",
                  allTasks: false,
                  isDisplayTask: true,
                });
              }}
            >
              Restart unsuccessful tasks
            </MenuItem>
          </Menu>
        ) : (
          <LoadingButton
            size="small"
            data-cy="restart-task"
            key="restart"
            disabled={disabled || !canRestart || isPatchOnCommitQueue}
            loading={loadingRestartTask}
            onClick={() => {
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              restartTask({ variables: { taskId, failedOnly: false } });
              taskAnalytics.sendEvent({
                name: "Clicked restart task button",
                isDisplayTask: false,
              });
            }}
          >
            Restart
          </LoadingButton>
        )}
        <Button
          size="small"
          data-cy="notify-task"
          key="notifications"
          disabled={disabled}
          onClick={() => {
            taskAnalytics.sendEvent({ name: "Viewed notification modal" });
            setIsVisibleModal(true);
          }}
        >
          Notify me
        </Button>
        <ButtonDropdown
          disabled={disabled}
          dropdownItems={dropdownItems}
          loading={
            loadingUnscheduleTask || loadingAbortTask || loadingSetPriority
          }
        />
      </PageButtonRow>
      <TaskNotificationModal
        visible={isVisibleModal}
        onCancel={() => setIsVisibleModal(false)}
      />
    </>
  );
};
