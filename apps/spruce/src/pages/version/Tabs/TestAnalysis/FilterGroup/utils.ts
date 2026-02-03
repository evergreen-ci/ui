import { TaskStatus } from "@evg-ui/lib/types";
import { TaskBuildVariantField } from "../types";

type BuildVariantNameTuple = {
  buildVariant: string;
  buildVariantDisplayName: string;
};

/**
 * `getAllBuildVariants` extracts all unique buildVariants from a map of test names to TaskBuildVariantField arrays.
 * @param taskMap - A Map of test names to an array of TaskBuildVariantField objects.
 * @returns - An array of unique buildVariants.
 */
const getAllBuildVariants = (
  taskMap: Map<string, TaskBuildVariantField[]>,
): BuildVariantNameTuple[] => {
  const buildVariantMap = new Map<string, string>();

  taskMap.forEach((taskArray) => {
    taskArray.forEach((task) => {
      const displayName = task.buildVariantDisplayName || task.buildVariant;
      buildVariantMap.set(task.buildVariant, displayName);
    });
  });

  return Array.from(buildVariantMap.entries()).map(
    ([buildVariant, buildVariantDisplayName]) => ({
      buildVariant,
      buildVariantDisplayName,
    }),
  );
};

/**
 * `getAllTaskStatuses` extracts all unique statuses from a map of test names to TaskBuildVariantField arrays.
 * @param taskMap - A Map of test names to an array of TaskBuildVariantField objects.
 * @returns - An array of unique statuses.
 */
const getAllTaskStatuses = (taskMap: Map<string, TaskBuildVariantField[]>) => {
  const statusSet = new Set<TaskStatus>();

  taskMap.forEach((taskArray) => {
    taskArray.forEach((task) => {
      statusSet.add(task.displayStatus as TaskStatus);
    });
  });

  return Array.from(statusSet);
};

export { getAllBuildVariants, getAllTaskStatuses };
