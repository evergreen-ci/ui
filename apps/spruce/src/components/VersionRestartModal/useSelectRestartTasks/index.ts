import { useState } from "react";
import { BuildVariantsWithChildrenQuery } from "gql/generated/types";

export const useSelectRestartTasks = (
  version: BuildVariantsWithChildrenQuery["version"],
) => {
  const { buildVariants } = version || {};
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());

  // Calculates selected tasks based on provided status filters.
  const selectByFilters = ({
    baseStatusFilters,
    statusFilters,
  }: {
    baseStatusFilters: string[];
    statusFilters: string[];
  }) => {
    const hasStatus = (status: string) => {
      if (statusFilters.length === 0) {
        return true;
      }
      return statusFilters.includes(status);
    };

    const hasBaseStatus = (status: string | null | undefined) => {
      if (baseStatusFilters.length === 0) {
        return true;
      }
      if (!status) {
        return false;
      }
      return baseStatusFilters.includes(status);
    };

    const selectedTasksCopy = new Set<string>(selectedTasks);
    if (baseStatusFilters.length > 0 || statusFilters.length > 0) {
      buildVariants?.forEach((bv) => {
        bv.tasks?.forEach((task) => {
          if (hasStatus(task.displayStatus) && hasBaseStatus(task.baseStatus)) {
            selectedTasksCopy.add(task.id);
          } else {
            selectedTasksCopy.delete(task.id);
          }
        });
      });
    } else {
      selectedTasksCopy.clear();
    }
    setSelectedTasks(selectedTasksCopy);
    return selectedTasksCopy;
  };

  // Handles toggling a group of tasks (if build-variant level) or individual tasks,
  // calculating selected tasks accordingly.
  const toggleSelectedTask = (taskIds: string[], isParentCheckbox: boolean) => {
    const selectedTasksCopy = new Set<string>(selectedTasks);
    // Handles clicking at build-variant level.
    if (isParentCheckbox) {
      const uncheckAllBoxes = taskIds.every((taskId) =>
        selectedTasksCopy.has(taskId),
      );
      if (uncheckAllBoxes) {
        taskIds.forEach((taskId) => {
          selectedTasksCopy.delete(taskId);
        });
      } else {
        taskIds.forEach((taskId) => {
          selectedTasksCopy.add(taskId);
        });
      }
    }
    // Handles clicking at task level.
    else {
      taskIds.forEach((taskId) => {
        if (selectedTasksCopy.has(taskId)) {
          selectedTasksCopy.delete(taskId);
        } else {
          selectedTasksCopy.add(taskId);
        }
      });
    }
    setSelectedTasks(selectedTasksCopy);
    return selectedTasksCopy;
  };

  return {
    selectedTasks,
    toggleSelectedTask,
    selectByFilters,
  };
};
