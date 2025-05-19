import { useUserSettings } from "hooks/useUserSettings";
import { useUserTimeZone } from "hooks/useUserTimeZone";
import { getDateCopy, DateCopyOptions } from "utils/string";

/**
 * A custom hook that formats a date string or Date object into a user-friendly format.
 * It uses the user's timezone and settings for date and time formats.
 * @returns A function that takes a date and options, and returns the formatted date string.
 * @example
 * const getDateFormat = useDateFormat();
 * const formattedDate = getDateFormat(new Date(), { dateOnly: true });
 */
export const useDateFormat = () => {
  const timezone = useUserTimeZone();
  const { userSettings } = useUserSettings();
  const { dateFormat, timeFormat } = userSettings || {};

  return (date: string | number | Date, options: DateCopyOptions = {}) =>
    getDateCopy(date, {
      tz: timezone,
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      dateFormat,
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      timeFormat,
      ...options,
    });
};
