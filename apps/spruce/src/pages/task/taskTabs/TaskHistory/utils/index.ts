import { TaskHistoryTask, GroupedTask } from "../types";

/**
 * `groupTasks` groups tasks into active and inactive tasks based on the `shouldCollapse` parameter.
 * @param tasks - an array of tasks returned from the TaskHistory query
 * @param shouldCollapse - a boolean. If set to false, no tasks will be collapsed. If set to true, inactive tasks will be collapsed.
 * @param expandedInactiveTasks - a list of inactive tasks that should be expanded
 * @returns an array of grouped tasks
 */
export const groupTasks = (
  tasks: TaskHistoryTask[],
  shouldCollapse: boolean,
  expandedInactiveTasks: string[][],
) => {
  const groupedTasks: GroupedTask[] = [];

  const pushInactive = (t: TaskHistoryTask) => {
    if (!groupedTasks?.[groupedTasks.length - 1]?.inactiveTasks) {
      groupedTasks.push({ task: null, inactiveTasks: [] });
    }
    groupedTasks[groupedTasks.length - 1].inactiveTasks?.push(t);
  };

  const pushActive = (t: TaskHistoryTask) => {
    groupedTasks.push({
      inactiveTasks: null,
      task: t,
    });
  };
  const expandedInactiveTasksSet = expandedInactiveTasks.reduce((acc, curr) => {
    curr.forEach((task) => {
      acc.add(task);
    });
    return acc;
  }, new Set<string>());
  tasks.forEach((task) => {
    if (
      !task.activated &&
      shouldCollapse &&
      !expandedInactiveTasksSet.has(task.id)
    ) {
      pushInactive(task);
    } else {
      pushActive(task);
    }
  });

  return groupedTasks;
};

/**
 * `getPrevPageCursor` extracts the task which comes directly before the previous page results.
 * @param item - the first item of visible tasks
 * @returns the task which can be used as the cursor to go to the previous page
 */
export const getPrevPageCursor = (item: GroupedTask) => {
  if (!item) {
    return null;
  }
  if (item.task) {
    return item.task;
  }
  return item.inactiveTasks[0];
};

/**
 * `getNextPageCursor` extracts the task which comes directly before the next page results.
 * @param item - the last item of visible tasks
 * @returns the task which can be used as the cursor to go to the next page
 */
export const getNextPageCursor = (item: GroupedTask) => {
  if (!item) {
    return null;
  }
  if (item.task) {
    return item.task;
  }
  return item.inactiveTasks[item.inactiveTasks.length - 1];
};
