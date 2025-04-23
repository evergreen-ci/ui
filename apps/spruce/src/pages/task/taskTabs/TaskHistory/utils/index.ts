import { TaskHistoryTask, GroupedTask } from "../types";

/**
 * `groupTasks` groups tasks into active and inactive tasks based on the `shouldCollapse` parameter.
 * @param tasks - an array of tasks returned from the TaskHistory query
 * @param shouldCollapse - a boolean. If set to false, no tasks will be collapsed. If set to true, inactive tasks will be collapsed.
 * @returns an array of grouped tasks
 */
export const groupTasks = (
  tasks: TaskHistoryTask[],
  shouldCollapse: boolean,
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

  tasks.forEach((task) => {
    if (!task.activated && shouldCollapse) {
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

/**
 * `countUniqueDates` counts the number of unique dates in the grouped tasks.
 * @param groupedTasks - an array of grouped tasks
 * @returns - the number of unique dates in the grouped tasks
 */
export const countUniqueDates = (groupedTasks: GroupedTask[]) => {
  const uniqueDates = new Set<string>();
  groupedTasks.forEach((group) => {
    if (group.task) {
      const dayMonthYear = new Date(group.task.createTime || "").toDateString();
      uniqueDates.add(dayMonthYear);
    } else if (group.inactiveTasks) {
      // For inactive tasks, we can use the first task's createTime since they are grouped together
      const dayMonthYear = new Date(
        group.inactiveTasks[0].createTime || "",
      ).toDateString();
      uniqueDates.add(dayMonthYear);
    }
  });
  return uniqueDates.size;
};

/**
 * `areDatesOnSameDay` checks if two dates are on the same day.
 * @param date1 - the first date to compare
 * @param date2 - the second date to compare
 * @returns - true if the two dates are on the same day, false otherwise
 */
export const areDatesOnSameDay = (
  date1?: Date | null,
  date2?: Date | null,
): boolean => {
  if (!date1 || !date2) {
    return false;
  }
  const parsedDate1 = new Date(date1);
  const parsedDate2 = new Date(date2);
  return (
    parsedDate1.getFullYear() === parsedDate2.getFullYear() &&
    parsedDate1.getMonth() === parsedDate2.getMonth() &&
    parsedDate1.getDate() === parsedDate2.getDate()
  );
};

/**
 * `extractTask` extracts the first task from a grouped task.
 * @param task - a grouped task
 * @returns - The first task in the group if it exists, otherwise null
 */
export const extractTask = (task: GroupedTask) => {
  if (task.task) {
    return task.task;
  }
  return task.inactiveTasks?.[0] || null;
};
