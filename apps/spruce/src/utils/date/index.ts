import { fromZonedTime } from "date-fns-tz";

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
