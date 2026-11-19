import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import pluralize from "pluralize";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { useTaskAnalytics } from "analytics";
import {
  ButtonDropdown,
  DropdownItem,
  usePopconfirmAnchor,
} from "components/ButtonDropdown";
import { LoadingButton } from "components/Buttons";
import SetPriority from "components/SetPriority";
import { PageButtonRow } from "components/styles";
import {
  AbortTaskMutation,
  AbortTaskMutationVariables,
  OverrideTaskDependenciesMutation,
  OverrideTaskDependenciesMutationVariables,
  ScheduleTasksMutation,
  ScheduleTasksMutationVariables,
  SetTaskPrioritiesMutation,
  SetTaskPrioritiesMutationVariables,
  TaskQuery,
  UnscheduleTaskMutation,
  UnscheduleTaskMutationVariables,
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
import { RestartButton } from "./RestartButton";
import { StepbackMenu } from "./StepbackMenu";

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

  const [priorityOpen, setPriorityOpen] = useState(false);
  const { anchorRef, getItemProps } = usePopconfirmAnchor({
    isOpen: priorityOpen,
    onClose: () => setPriorityOpen(false),
  });

  const dropdownItems = [
    <DropdownItem
      key="unschedule"
      data-testid="unschedule-task"
      isDisabled={disabled || !canUnschedule}
      onAction={() => {
        unscheduleTask({ variables: { taskId } });
        taskAnalytics.sendEvent({ name: "Clicked unschedule task button" });
      }}
    >
      Unschedule
    </DropdownItem>,
    <DropdownItem
      key="abort"
      data-testid="abort-task"
      isDisabled={disabled || !canAbort}
      onAction={() => {
        abortTask({ variables: { taskId } });
        taskAnalytics.sendEvent({ name: "Clicked abort task button" });
      }}
    >
      Abort
    </DropdownItem>,
    <DropdownItem
      key="disable-task"
      data-testid="disable-enable"
      isDisabled={disabled || !canDisable}
      onAction={() => {
        setTaskPriority({
          variables: {
            taskPriorities: [
              { taskId, priority: initialPriority < 0 ? 0 : -1 },
            ],
          },
        });
        taskAnalytics.sendEvent({
          name:
            initialPriority < 0
              ? "Clicked enable task button"
              : "Clicked disable task button",
        });
      }}
    >
      <span
        title={
          initialPriority < 0
            ? ""
            : "Disabling a task prevents it from being run unless explicitly activated by a user."
        }
      >
        {initialPriority < 0 ? "Enable" : "Disable"}
      </span>
    </DropdownItem>,
    <DropdownItem
      key="set-task-priority"
      data-testid="set-priority-menu-item"
      isDisabled={disabled || !canSetPriority}
      {...getItemProps("priority", () => setPriorityOpen(true), priorityOpen)}
    >
      Set task priority
    </DropdownItem>,
    <DropdownItem
      key="override-dependencies"
      data-testid="override-dependencies"
      isDisabled={disabled || !canOverrideDependencies}
      onAction={() => {
        overrideTaskDependencies({ variables: { taskId } });
        taskAnalytics.sendEvent({
          name: "Clicked override dependencies button",
        });
      }}
    >
      Override Dependencies
    </DropdownItem>,
  ];

  return (
    <PageButtonRow>
      <MarkReviewed execution={task.execution} taskId={task.id} />
      {!isExecutionTask && <StepbackMenu task={task} />}
      <LoadingButton
        key="schedule"
        data-testid="schedule-task"
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
        setOpen={(isOpen) => {
          if (!isOpen) {
            setPriorityOpen(false);
          }
        }}
      />
      {priorityOpen && (
        <SetPriority
          initialPriority={initialPriority}
          onOpenChange={setPriorityOpen}
          open
          refEl={anchorRef}
          taskIds={[taskId]}
        />
      )}
    </PageButtonRow>
  );
};
