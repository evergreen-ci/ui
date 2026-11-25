import { useMutation } from "@apollo/client/react";
import { MenuItem, Text } from "@via-ds/components";
import pluralize from "pluralize";
import { useToastContext } from "@evg-ui/lib/context/toast";
import {
  ScheduleTasksByFilterMutation,
  ScheduleTasksByFilterMutationVariables,
  ScheduleTasksByIdsMutation,
  ScheduleTasksByIdsMutationVariables,
} from "gql/generated/types";
import { SCHEDULE_TASKS_BY_FILTER, SCHEDULE_TASKS_BY_IDS } from "gql/mutations";
import { SelectedMode, SelectionState } from "pages/version/TaskSelection";

interface BulkOperationResult {
  modifiedTasks: unknown[];
  taskErrors: { taskId: string; reason: string }[];
}

interface ScheduleTasksProps {
  clearSelection: () => void;
  taskSelection: SelectionState | null;
  versionId: string;
}

export const ScheduleTasks: React.FC<ScheduleTasksProps> = ({
  clearSelection,
  taskSelection,
  versionId,
}) => {
  const dispatchToast = useToastContext();

  const onCompleted = ({ modifiedTasks, taskErrors }: BulkOperationResult) => {
    if (modifiedTasks.length > 0) {
      dispatchToast.success(
        `Scheduled ${modifiedTasks.length} ${pluralize("task", modifiedTasks.length)}`,
      );
    }
    if (taskErrors.length > 0) {
      dispatchToast.warning(
        `Unable to schedule ${taskErrors.length} ${pluralize("task", taskErrors.length)}`,
      );
    }
  };

  const onError = (err: Error) => {
    dispatchToast.error(`Unable to schedule tasks: ${err.message}`);
  };

  const [scheduleTasksByIds] = useMutation<
    ScheduleTasksByIdsMutation,
    ScheduleTasksByIdsMutationVariables
  >(SCHEDULE_TASKS_BY_IDS, {
    onCompleted: (data) => onCompleted(data.scheduleTasksByIds),
    onError,
    refetchQueries: ["VersionTasks"],
  });

  const [scheduleTasksByFilter] = useMutation<
    ScheduleTasksByFilterMutation,
    ScheduleTasksByFilterMutationVariables
  >(SCHEDULE_TASKS_BY_FILTER, {
    onCompleted: (data) => onCompleted(data.scheduleTasksByFilter),
    onError,
    refetchQueries: ["VersionTasks"],
  });

  const scheduleTasks = () => {
    if (taskSelection === null) {
      return;
    }
    if (taskSelection.mode === SelectedMode.Include) {
      scheduleTasksByIds({
        variables: { taskIds: [...taskSelection.taskIds] },
      });
    } else {
      scheduleTasksByFilter({
        variables: {
          versionId,
          filter: {
            ...taskSelection.filter,
            excludeTaskIds: Array.from(taskSelection.excludedIds),
          },
        },
      });
    }
    clearSelection();
  };

  return (
    <MenuItem
      data-testid="schedule-selected-tasks"
      id="schedule-selected-tasks"
      onAction={scheduleTasks}
      textValue="Schedule tasks"
    >
      <Text>Schedule tasks</Text>
    </MenuItem>
  );
};
