import { getDateCopy, DateCopyOptions } from "utils/string";
import { useUserSettings } from "./useUserSettings";
import { useUserTimeZone } from "./useUserTimeZone";

export const useDateFormat = () => {
  const timezone = useUserTimeZone();
  const { userSettings } = useUserSettings();
  const { dateFormat, timeFormat } = userSettings || {};

  return (date: string | number | Date, options: DateCopyOptions = {}) =>
    getDateCopy(date, {
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      tz: timezone,
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      dateFormat,
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      timeFormat,
      ...options,
    });
};
