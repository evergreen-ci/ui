import { useState } from "react";
import { useMutation } from "@apollo/client";
import Button from "@leafygreen-ui/button";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { useTaskAnalytics } from "analytics";
import { DropdownItem, ButtonDropdown } from "components/ButtonDropdown";
import { LoadingButton } from "components/Buttons";
import SetPriority from "components/SetPriority";
import { PageButtonRow } from "components/styles";
import { getTaskHistoryRoute } from "constants/routes";
import {
  SetTaskPriorityMutation,
  SetTaskPriorityMutationVariables,
  AbortTaskMutation,
  AbortTaskMutationVariables,
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
  SCHEDULE_TASKS,
  SET_TASK_PRIORITY,
  UNSCHEDULE_TASK,
} from "gql/mutations";
import { useLGButtonRouterLink } from "hooks/useLGButtonRouterLink";
import { RelevantCommits } from "./actionButtons/RelevantCommits";
import { RestartButton } from "./actionButtons/RestartButton";
import { TaskNotificationModal } from "./actionButtons/TaskNotificationModal";

interface Props {
  initialPriority?: number;
  isDisplayTask: boolean;
  isExecutionTask: boolean;
  task: NonNullable<TaskQuery["task"]>;
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
    canSchedule,
    canSetPriority,
    canUnschedule,
    displayName,
    id: taskId,
    project,
    versionMetadata,
  } = task || {};

  const { id: versionId, isPatch, order } = versionMetadata || {};
  const { identifier: projectIdentifier } = project || {};

  const dispatchToast = useToastContext();
  const [isVisibleModal, setIsVisibleModal] = useState(false);

  const taskAnalytics = useTaskAnalytics();

  const [scheduleTask, { loading: loadingScheduleTask }] = useMutation<
    ScheduleTasksMutation,
    ScheduleTasksMutationVariables
  >(SCHEDULE_TASKS, {
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
    variables: { taskId },
    onCompleted: () => {
      dispatchToast.success("Task aborted");
    },
    onError: (err) => {
      dispatchToast.error(`Error aborting task: ${err.message}`);
    },
  });

  const [setTaskPriority, { loading: loadingSetPriority }] = useMutation<
    SetTaskPriorityMutation,
    SetTaskPriorityMutationVariables
  >(SET_TASK_PRIORITY, {
    onCompleted: (data) => {
      const newPriority = data?.setTaskPriority?.priority || 0;
      dispatchToast.success(
        newPriority >= 0
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
      taskId: taskId,
    }),
  );

  const disabled =
    loadingAbortTask ||
    loadingSetPriority ||
    loadingUnscheduleTask ||
    loadingScheduleTask ||
    loadingOverrideTaskDependencies;

  const dropdownItems = [
    <DropdownItem
      key="unschedule"
      data-cy="unschedule-task"
      disabled={disabled || !canUnschedule}
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
    <SetPriority
      key="set-task-priority"
      disabled={disabled || !canSetPriority}
      initialPriority={initialPriority}
      taskId={taskId}
    />,
    <DropdownItem
      key="override-dependencies"
      data-cy="override-dependencies"
      disabled={disabled || !canOverrideDependencies}
      onClick={() => overrideTaskDependencies({ variables: { taskId } })}
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
              key="task-history"
              as={HistoryLink}
              data-cy="task-history"
              onClick={() => {
                taskAnalytics.sendEvent({ name: "Clicked see history link" });
              }}
              size="small"
            >
              See history
            </Button>
          </>
        )}
        <LoadingButton
          key="schedule"
          data-cy="schedule-task"
          disabled={disabled || !canSchedule}
          loading={loadingScheduleTask}
          onClick={() => {
            scheduleTask();
            taskAnalytics.sendEvent({ name: "Clicked schedule task button" });
          }}
          size="small"
        >
          Schedule
        </LoadingButton>
        <RestartButton isDisplayTask={isDisplayTask} task={task} />
        <Button
          key="notifications"
          data-cy="notify-task"
          disabled={disabled}
          onClick={() => {
            taskAnalytics.sendEvent({ name: "Viewed notification modal" });
            setIsVisibleModal(true);
          }}
          size="small"
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
        onCancel={() => setIsVisibleModal(false)}
        visible={isVisibleModal}
      />
    </>
  );
};
