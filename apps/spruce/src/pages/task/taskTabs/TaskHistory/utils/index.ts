import { fromZonedTime } from "date-fns-tz";
import { TaskHistoryTask, GroupedTask } from "../types";

/**
 * `groupTasks` groups tasks into active and inactive tasks based on the `shouldCollapse` parameter.
 * @param tasks - an array of tasks returned from the TaskHistory query
 * @param shouldCollapse - a boolean. If set to false, no tasks will be collapsed. If set to true, inactive tasks will be collapsed.
 * @param timezone - the user's timezone, may be undefined
 * @param testFailureSearchTerm - a regex to filter tasks by test failures.
 * @returns an array of grouped tasks
 */
export const groupTasks = (
  tasks: TaskHistoryTask[],
  shouldCollapse: boolean,
  timezone?: string,
  testFailureSearchTerm: RegExp | null,
) => {
  const groupedTasks: GroupedTask[] = [];

  const pushInactive = (
    t: TaskHistoryTask,
    shouldShowDateSeparator: boolean,
  ) => {
    if (!groupedTasks?.[groupedTasks.length - 1]?.inactiveTasks) {
      groupedTasks.push({
        task: null,
        inactiveTasks: [],
        shouldShowDateSeparator,
        isMatching: false,
      });
    }
    groupedTasks[groupedTasks.length - 1].inactiveTasks?.push(t);
  };

  const pushActive = (t: TaskHistoryTask, shouldShowDateSeparator: boolean) => {
    const isMatching =
      !testFailureSearchTerm ||
      t.tests.testResults.some(({ testFile }) =>
        testFile.match(testFailureSearchTerm),
      );
    groupedTasks.push({
      inactiveTasks: null,
      task: t,
      isMatching,
      shouldShowDateSeparator,
    });
  };

  tasks.forEach((task, i) => {
    let shouldShowDateSeparator = false;
    if (i === 0) {
      shouldShowDateSeparator = true;
    } else {
      const prevTask = tasks[i - 1];
      shouldShowDateSeparator = !areDatesOnSameDay(
        prevTask?.createTime,
        task.createTime,
        timezone,
      );
    }

    if (!task.activated && shouldCollapse) {
      pushInactive(task, shouldShowDateSeparator);
    } else {
      pushActive(task, shouldShowDateSeparator);
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
