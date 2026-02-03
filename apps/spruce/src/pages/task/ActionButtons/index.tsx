import { useMutation } from "@apollo/client/react";
import pluralize from "pluralize";
import { useToastContext } from "@evg-ui/lib/context";
import { useTaskAnalytics } from "analytics";
import { DropdownItem, ButtonDropdown } from "components/ButtonDropdown";
import { LoadingButton } from "components/Buttons";
import SetPriority from "components/SetPriority";
import { PageButtonRow } from "components/styles";
import {
  SetTaskPrioritiesMutation,
  SetTaskPrioritiesMutationVariables,
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
  SET_TASK_PRIORITIES,
  UNSCHEDULE_TASK,
} from "gql/mutations";
import { MarkReviewed } from "./MarkReviewed";
import { NotifyMeButton } from "./NotifyMeButton";
import { RelevantCommits } from "./RelevantCommits";
import { RestartButton } from "./RestartButton";

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
    canAbort,
    canDisable,
    canOverrideDependencies,
    canSchedule,
    canSetPriority,
    canUnschedule,
    id: taskId,
    versionMetadata,
  } = task || {};
  const { id: versionId } = versionMetadata || {};

  const dispatchToast = useToastContext();

  const taskAnalytics = useTaskAnalytics();

  const [scheduleTask, { loading: loadingScheduleTask }] = useMutation<
    ScheduleTasksMutation,
    ScheduleTasksMutationVariables
  >(SCHEDULE_TASKS, {
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
    onCompleted: () => {
      dispatchToast.success("Task aborted");
    },
    onError: (err) => {
      dispatchToast.error(`Error aborting task: ${err.message}`);
    },
  });

  const [setTaskPriority, { loading: loadingSetPriority }] = useMutation<
    SetTaskPrioritiesMutation,
    SetTaskPrioritiesMutationVariables
  >(SET_TASK_PRIORITIES, {
    onCompleted: (data) => {
      dispatchToast.success(
        data.setTaskPriorities.some(({ priority }) => (priority ?? 0) >= 0)
          ? `Priority updated for ${data.setTaskPriorities.length} ${pluralize("task", data.setTaskPriorities.length)}.`
          : `${pluralize("Task", data.setTaskPriorities.length)} successfully disabled.`,
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
        unscheduleTask({ variables: { taskId } });
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
        abortTask({ variables: { taskId } });
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
          variables: {
            taskPriorities: [
              { taskId, priority: initialPriority < 0 ? 0 : -1 },
            ],
          },
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
      taskIds={[taskId]}
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
    <PageButtonRow>
      <MarkReviewed execution={task.execution} taskId={task.id} />
      {!isExecutionTask && <RelevantCommits task={task} />}
      <LoadingButton
        key="schedule"
        data-cy="schedule-task"
        disabled={disabled || !canSchedule}
        loading={loadingScheduleTask}
        onClick={() => {
          scheduleTask({ variables: { taskIds: [taskId], versionId } });
          taskAnalytics.sendEvent({ name: "Clicked schedule task button" });
        }}
        size="small"
      >
        Schedule
      </LoadingButton>
      <RestartButton isDisplayTask={isDisplayTask} task={task} />
      <NotifyMeButton taskId={taskId} />
      <ButtonDropdown
        disabled={disabled}
        dropdownItems={dropdownItems}
        loading={
          loadingUnscheduleTask || loadingAbortTask || loadingSetPriority
        }
      />
    </PageButtonRow>
  );
};
