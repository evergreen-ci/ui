import { fromZonedTime } from "date-fns-tz";
import { TaskHistoryTask, GroupedTask } from "../types";

/**
 * `groupTasks` groups tasks into active and inactive tasks based on the `shouldCollapse` parameter.
 * @param tasks - an array of tasks returned from the TaskHistory query
 * @param options - an object containing options for grouping tasks
 * @param options.shouldCollapse - a boolean. If set to false, no tasks will be collapsed. If set to true, inactive tasks will be collapsed.
 * @param options.testFailureSearchTerm - a regex to filter tasks by test failures.
 * @param options.timezone - the user's timezone, may be undefined
 * @returns an array of grouped tasks
 */
export const groupTasks = (
  tasks: TaskHistoryTask[],
  options: {
    shouldCollapse: boolean;
    testFailureSearchTerm: RegExp | null;
    timezone?: string;
  },
) => {
  const groupedTasks: GroupedTask[] = [];
  const { shouldCollapse, testFailureSearchTerm, timezone } = options;

  const pushInactive = (t: TaskHistoryTask) => {
    if (!groupedTasks?.[groupedTasks.length - 1]?.inactiveTasks) {
      groupedTasks.push({
        date: null,
        task: null,
        inactiveTasks: [],
        isMatching: false,
      });
    }
    groupedTasks[groupedTasks.length - 1].inactiveTasks?.push(t);
  };

  const pushActive = (t: TaskHistoryTask) => {
    const isMatching =
      !testFailureSearchTerm ||
      t.tests.testResults.some(({ testFile }) =>
        testFile.match(testFailureSearchTerm),
      );
    groupedTasks.push({
      date: null,
      inactiveTasks: null,
      task: t,
      isMatching,
    });
  };

  const pushDate = (t: TaskHistoryTask) => {
    groupedTasks.push({
      date: new Date(t.createTime ?? ""),
      inactiveTasks: null,
      task: null,
      isMatching: false,
    });
  };

  tasks.forEach((task, i) => {
    let shouldShowDateSeparator = false;
    if (i === 0) {
      shouldShowDateSeparator = true;
    } else {
      const prevTask = tasks[i - 1];
      shouldShowDateSeparator = !areDatesOnSameDay(
        prevTask.createTime,
        task.createTime,
        timezone,
      );
    }

    if (shouldShowDateSeparator) {
      pushDate(task);
    }
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
 * @param items - visible tasks
 * @returns the task which can be used as the cursor to go to the previous page
 */
export const getPrevPageCursor = (items: GroupedTask[]) => {
  // Filter out date separators as they cannot be used as cursors.
  const item = items.filter((i) => i.date === null)[0];
  if (!item) {
    return null;
  }
  if (item.task) {
    return item.task;
  }
  if (item.inactiveTasks) {
    return item.inactiveTasks[0];
  }
  return null;
};

/**
 * `getNextPageCursor` extracts the task which comes directly before the next page results.
 * @param items - visible tasks
 * @returns the task which can be used as the cursor to go to the next page
 */
export const getNextPageCursor = (items: GroupedTask[]) => {
  // Filter out date separators as they cannot be used as cursors.
  const item = items.filter((i) => i.date === null).slice(-1)[0];
  if (!item) {
    return null;
  }
  if (item.task) {
    return item.task;
  }
  if (item.inactiveTasks) {
    return item.inactiveTasks[item.inactiveTasks.length - 1];
  }
  return null;
};

/**
 * `areDatesOnSameDay` checks if two dates are on the same day.
 * @param date1 - the first date to compare
 * @param date2 - the second date to compare
 * @param timezone - the user's timezone, may be undefined
 * @returns - true if the two dates are on the same day, false otherwise
 */
export const areDatesOnSameDay = (
  date1?: Date | null,
  date2?: Date | null,
  timezone?: string,
): boolean => {
  if (!date1 || !date2) {
    return false;
  }
  const parsedDate1 = timezone
    ? fromZonedTime(new Date(date1), timezone)
    : new Date(date1);
  const parsedDate2 = timezone
    ? fromZonedTime(new Date(date2), timezone)
    : new Date(date2);
  return (
    parsedDate1.getFullYear() === parsedDate2.getFullYear() &&
    parsedDate1.getMonth() === parsedDate2.getMonth() &&
    parsedDate1.getDate() === parsedDate2.getDate()
  );
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
