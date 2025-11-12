import { GeneratedTaskCountResults, VariantTask } from "gql/generated/types";
import { VariantTasksState } from "pages/configurePatch/configurePatchCore/useConfigurePatch/types";

/**
 * The following functions compute the number of tasks that are estimated to be scheduled as a result of a scheduling / restart operation,
 * depending on the type of data structure that is in.
 */

/**
 * `sumActivatedTasksInSet` Computes activated tasks for the "Schedule Tasks" modal. 
 * Sums the input set size with the `estimatedTasks` values from the `GeneratedTaskCounts` array for tasks that are present in the provided `Set`.
 * @param taskIdSet - A set of task ID strings. This set defines which tasks to include in the sum.
 * @param generatedTaskCounts - An array of objects containing info on the estimated number of tasks that each generator task (a task that calls generate.tasks)
 will schedule, including the `taskId`, `buildVariantName`, `taskName`, and `estimatedTasks`.
 * @returns The total sum of `estimatedTasks` for tasks that exist in both the `taskIdSet` and the `generatedTaskCounts` array, plus the size of the set.
 */
export const sumActivatedTasksInSet = (
  taskIdSet: Set<string>,
  generatedTaskCounts: GeneratedTaskCountResults[],
): number =>
  generatedTaskCounts.reduce((total, { estimatedTasks, taskId }) => {
    if (taskId && taskIdSet.has(taskId)) {
      return total + estimatedTasks;
    }
    return total;
  }, taskIdSet.size);

/**
 * `sumActivatedTasksInVariantsTasks` Computes activated tasks for the "Configure Patch" page.
 * Sums the number tasks that are both present the provided `VariantTasksState` and NOT present
 * in the provided `VariantTask[], with the total `estimatedTasks` from the `GeneratedTaskCounts` array for those tasks`.
 * @param selectedTasks - A VariantTasksState object representing the tasks that are currently selected on the page.
 * @param generatedTaskCounts - An array of objects containing info on the estimated number of tasks that each generator task
 * (a task that calls generate.tasks) will schedule, including the `taskId`, `buildVariantName`, `taskName`, and `estimatedTasks`.
 * @param existingVariantsTasks - An array of VariantTask, representing the initial state of selected tasks in the "Configure Patch" page.
 * @returns The total sum of tasks that are selected in the `selectedTasks` map and their corresponding `estimatedTasks` that exist in
 * the `generatedTaskCounts` array.
 */
export const sumActivatedTasksInVariantsTasks = (
  selectedTasks: VariantTasksState,
  generatedTaskCounts: GeneratedTaskCountResults[],
  existingVariantsTasks: VariantTask[],
): number => {
  // Create a set of existing tasks from existingVariantsTasks
  const existingTasks = new Set<string>(
    existingVariantsTasks.flatMap((variantTask) =>
      variantTask.tasks.map((task) => `${variantTask.name}-${task}`),
    ),
  );

  // Sum the estimated tasks for selected tasks that are not in existingTasks
  return Object.entries(selectedTasks).reduce(
    (total, [variant, tasks]) =>
      Object.entries(tasks).reduce((innerTotal, [taskName, isSelected]) => {
        if (isSelected && !existingTasks.has(`${variant}-${taskName}`)) {
          const generatedTaskCount =
            generatedTaskCounts.find(
              (count) =>
                count.buildVariantName === variant &&
                count.taskName === taskName,
            )?.estimatedTasks || 0;
          return innerTotal + 1 + generatedTaskCount;
        }
        return innerTotal;
      }, total),
    0,
  );
};

/**
 * `sumActivatedTasksInSelectedTasks` Computes tasks for the "Restart Version" modal.
 * Sums the number tasks that are both present the provided `versionSelectedTasks`, with the total `estimatedTasks` from the `GeneratedTaskCounts`
 * array for those tasks`.
 * @param selectedTasks - Array of sets representing the tasks that are currently selected on the page.
 * @param generatedTaskCounts - An array of objects containing info on the estimated number of tasks that each generator task (a task that calls generate.tasks)
 *  will schedule, including the `taskId`, `buildVariantName`, `taskName`, and `estimatedTasks`.
 * @returns The total sum of tasks that are selected in the `selectedTasks` map and their corresponding `estimatedTasks` that exist in
 * the `generatedTaskCounts` array.
 */
export const sumActivatedTasksInSelectedTasks = (
  selectedTasks: Set<string>[],
  generatedTaskCounts: GeneratedTaskCountResults[],
) =>
  // Sum the total estimated tasks from the selected tasks
  selectedTasks.reduce(
    (total, tasks) =>
      Array.from(tasks).reduce((innerTotal, taskId) => {
        const generatedTaskCount =
          generatedTaskCounts.find((count) => count.taskId === taskId)
            ?.estimatedTasks || 0;
        return innerTotal + 1 + generatedTaskCount;
      }, total),
    0,
  );
