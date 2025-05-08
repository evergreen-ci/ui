import { fromZonedTime } from "date-fns-tz";
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
 * `getUTCEndOfDay` calculates a UTC timestamp for the end of the day based on the user's timezone.
 * @param date - any date in YYYY-MM-DD format
 * @param timezone - the user's timezone, may be undefined
 * @returns 23:59:59 timestamp for the given date converted into UTC from user's local timezone
 */
export const getUTCEndOfDay = (date: string | null, timezone?: string) => {
  if (!date) {
    return undefined;
  }
  const midnightLocalTime = new Date(`${date} 23:59:59`);
  if (timezone) {
    return fromZonedTime(midnightLocalTime, timezone);
  }
  return midnightLocalTime;
};
