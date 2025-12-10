import { format, toZonedTime } from "date-fns-tz";
import { TimeFormat } from "constants/time";

export { githubPRLinkify, jiraLinkify } from "./Linkify";

/**
 * `msToDuration` converts a number of milliseconds to a string representing the duration
 * @param ms - milliseconds
 * @returns - a string representing the duration in the format of "1d 2h 3m 4s"
 */
export const msToDuration = (ms: number): string => {
  if (ms === 0) {
    return "0s";
  }
  const msPerDay = 24 * 60 * 60 * 1000;
  const days = Math.floor(ms / msPerDay);
  const daysMilli = ms % msPerDay;

  const msPerHour = 60 * 60 * 1000;
  const hours = Math.floor(daysMilli / msPerHour);
  const hoursMilli = ms % msPerHour;

  const msPerMinute = 60 * 1000;
  const minutes = Math.floor(hoursMilli / msPerMinute);
  const minutesMilli = ms % msPerMinute;

  const seconds = Math.floor(minutesMilli / 1000);

  if (days > 0) {
    return `${Math.trunc(days)}d ${hours}h ${minutes}m ${seconds}s`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  if (seconds > 0) {
    return `${seconds}s`;
  }
  return `${ms}ms`;
};

/**
 * `stringifyNanoseconds` converts a number of nanoseconds to a string representing the duration
 * @param input - nanoseconds
 * @param skipDayMax - if true, will not display days if the duration is greater than 24 hours
 * @param skipSecMax - if true, will not display seconds if the duration is greater than 60 seconds
 * @returns - a string representing the duration in the format of "1d 2h 3m 4s"
 * @example
 * stringifyNanoseconds(1000000000000) // "11 days"
 * stringifyNanoseconds(1000000000000, true) // "11 days"
 */
export const stringifyNanoseconds = (
  input: number,
  skipDayMax: boolean,
  skipSecMax: boolean,
) => {
  const NS_PER_MS = 1000 * 1000; // 10^6
  const NS_PER_SEC = NS_PER_MS * 1000;
  const NS_PER_MINUTE = NS_PER_SEC * 60;
  const NS_PER_HOUR = NS_PER_MINUTE * 60;

  if (input === 0) {
    return "0 seconds";
  }
  if (input < NS_PER_MS) {
    return "< 1 ms";
  }
  if (input < NS_PER_SEC) {
    if (skipSecMax) {
      return `${Math.floor(input / NS_PER_MS)} ms`;
    }
    return "< 1 second";
  }
  if (input < NS_PER_MINUTE) {
    return `${Math.floor(input / NS_PER_SEC)} seconds`;
  }
  if (input < NS_PER_HOUR) {
    return `${Math.floor(input / NS_PER_MINUTE)}m ${Math.floor(
      (input % NS_PER_MINUTE) / NS_PER_SEC,
    )}s`;
  }
  if (input < NS_PER_HOUR * 24 || skipDayMax) {
    return `${Math.floor(input / NS_PER_HOUR)}h ${Math.floor(
      (input % NS_PER_HOUR) / NS_PER_MINUTE,
    )}m ${Math.floor((input % NS_PER_MINUTE) / NS_PER_SEC)}s`;
  }
  return ">= 1 day";
};

export type DateCopyOptions = {
  tz?: string;
  dateOnly?: boolean;
  omitSeconds?: boolean;
  omitTimezone?: boolean;
  dateFormat?: string;
  timeFormat?: string;
};

/**
 * `getDateCopy` converts a date to a string in the format of "MMM d, yyyy h:mm:ss a z"
 * @param time - a string, number, or Date object
 * @param options - an object with options for formatting the date
 * @param options.tz - a timezone string, such as "America/Los_Angeles"
 * @param options.dateOnly - if true, will only return the date, not the time
 * @param options.omitSeconds - if true, will not return the seconds
 * @param options.omitTimezone - if true, will not return the timezone
 * @param options.dateFormat - a date format string, such as "MMM d, yyyy"
 * @returns - a string representing the date in either the user's specified format or the default, "MMM d, yyyy h:mm:ss aa z"
 */
export const getDateCopy = (
  time: string | number | Date,
  options?: DateCopyOptions,
) => {
  if (!time) {
    return "";
  }
  const { dateOnly, omitSeconds, omitTimezone, tz } = options || {};
  let { dateFormat, timeFormat } = options || {};
  if (!dateFormat) {
    dateFormat = "MMM d, yyyy";
  }
  if (!timeFormat) {
    timeFormat = TimeFormat.TwelveHour;
  }
  if (omitSeconds) {
    timeFormat = timeFormat.replace(":ss", "");
  }
  const finalDateFormat = dateOnly
    ? dateFormat
    : `${dateFormat}, ${timeFormat}${omitTimezone ? "" : " z"}`;
  if (tz) {
    return format(toZonedTime(time, tz), finalDateFormat, {
      timeZone: tz,
    });
  }

  return format(new Date(time), finalDateFormat);
};

/**
 * `sortFunctionString` is a helper function for sorting an array of objects by a string key
 * @param a - the first object to compare
 * @param b - the second object to compare
 * @param key - the key to sort by (supports dot notation for nested keys, e.g. "a.b.c")
 * @returns - a number representing the sort order
 * @example
 * const arr = [{ name: "b" }, { name: "a" }];
 * arr.sort((a, b) => sortFunctionString(a, b, "name"));
 * // [{ name: "a" }, { name: "b" }]
 */
export const sortFunctionString = <T>(a: T, b: T, key: string) => {
  const keys = key.split(".");
  const getNestedValue = (obj: unknown): string => {
    let value: unknown = obj;
    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k];
    }
    return (value as string).toUpperCase();
  };
  const nameA = getNestedValue(a);
  const nameB = getNestedValue(b);
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  return 0;
};

/**
 * @param  str - A string that does not contain regex operators.
 * @returns A regex that strictly matches on the input.
 */
export const applyStrictRegex = (str: string) => `^${str}$`;

/**
 * Convert an array of strings into a string that lists them, separated by commas and with a coordinating conjunction (i.e. "and" or "or") preceding the last word.
 * E.g. joinWithConjunction(["spruce", "app", "plt"], "and") => "spruce, app, and plt"
 * @param array - List of words.
 * @param conjunction - Word such as "and" or "or" that should precede the last list item.
 * @returns List items joined by a comma with the coordinating conjunction
 */
export const joinWithConjunction = (array: string[], conjunction: string) => {
  if (array.length === 0) {
    return "";
  }
  if (array.length === 1) {
    return array[0];
  }
  if (array.length === 2) {
    return `${array[0]} ${conjunction} ${array[1]}`;
  }
  return `${array.slice(0, -1).join(", ")}, ${conjunction} ${array.slice(-1)}`;
};

/**
 * Given a string, strips new line characters.
 * @param str - string to remove new lines from
 * @returns string with new lines removed
 */
export const stripNewLines = (str: string) => str.replace(/\n/g, "");

/**
 * Given a JIRA URL, extract the ticket number.
 * @param jiraURL - the URL from which to extract the ticket number
 * @returns the JIRA ticket number
 */
export const getTicketFromJiraURL = (jiraURL: string) => {
  const ticketNumber = jiraURL.match(/[A-Z]+-[0-9]+/)?.[0];
  return ticketNumber;
};
