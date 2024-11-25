import { useUserSettings } from "hooks/useUserSettings";
import { useUserTimeZone } from "hooks/useUserTimeZone";
import { getDateCopy, DateCopyOptions } from "utils/string";

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
