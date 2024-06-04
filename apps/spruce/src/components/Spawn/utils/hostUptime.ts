import { setToUTCMidnight } from "@leafygreen-ui/date-utils";
import {
  isAfter,
  isBefore,
  differenceInHours,
  isTomorrow,
  parse,
} from "date-fns";
import { ValidateProps } from "components/SpruceForm";
import { days } from "constants/fieldMaps";
import { SleepSchedule, SleepScheduleInput } from "gql/generated/types";
import { Optional } from "types/utils";
import { arraySymmetricDifference } from "utils/array";
import { isProduction } from "utils/environmentVariables";

const daysInWeek = 7;
const hoursInDay = 24;
const defaultStartHour = 8;
const defaultStopHour = 20;
const defaultScheduleWeeklyHourCount = 60;
const defaultScheduleWeekdaysCount = 5;

const suggestedUptimeHours = (daysInWeek - 2) * hoursInDay;
export const maxUptimeHours = (daysInWeek - 1) * hoursInDay;

// @ts-expect-error: FIXME. This comment was added by an automated script.
export const defaultStartDate = new Date(null, null, null, defaultStartHour);
// @ts-expect-error: FIXME. This comment was added by an automated script.
export const defaultStopDate = new Date(null, null, null, defaultStopHour);

export type HostUptime = {
  useDefaultUptimeSchedule: boolean;
  sleepSchedule?: {
    enabledWeekdays: boolean[];
    timeSelection: {
      startTime: string;
      stopTime: string;
      runContinuously: boolean;
    };
  };
  details?: null;
  temporarilyExemptUntil?: string;
};

type ValidateInput = {
  enabledHoursCount: number;
  enabledWeekdaysCount: number;
  runContinuously: boolean;
};

export const getHostUptimeWarnings = ({
  enabledHoursCount,
  enabledWeekdaysCount,
  runContinuously,
}: ValidateInput): string[] => {
  if (enabledHoursCount > maxUptimeHours) {
    // This state represents an error, which is handled by the RJSF validator.
    return [];
  }

  if (enabledHoursCount > suggestedUptimeHours) {
    // Return warning based on whether runContinuously enabled
    if (runContinuously) {
      return ["Consider pausing your host for 2 days per week."];
    }
    const hourlySuggestion = Math.floor(
      suggestedUptimeHours / enabledWeekdaysCount,
    );
    return [
      `Consider running your host for ${hourlySuggestion} hours per day or fewer.`,
    ];
  }

  // No error
  return [];
};

export const getEnabledHoursCount = (
  hostUptime: HostUptime,
): { enabledHoursCount: number; enabledWeekdaysCount: number } => {
  if (!hostUptime) {
    return {
      enabledHoursCount: defaultScheduleWeeklyHourCount,
      enabledWeekdaysCount: defaultScheduleWeekdaysCount,
    };
  }

  const {
    sleepSchedule: {
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      enabledWeekdays,
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      timeSelection: { runContinuously, startTime, stopTime },
    },
    useDefaultUptimeSchedule,
  } = hostUptime;

  if (useDefaultUptimeSchedule) {
    return {
      enabledHoursCount: defaultScheduleWeeklyHourCount,
      enabledWeekdaysCount: defaultScheduleWeekdaysCount,
    };
  }

  const enabledWeekdaysCount =
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    enabledWeekdays?.filter((day) => day).length ?? 0;
  const enabledHoursCount = runContinuously
    ? enabledWeekdaysCount * hoursInDay
    : enabledWeekdaysCount * getDailyUptime({ startTime, stopTime });
  return { enabledHoursCount, enabledWeekdaysCount };
};

export const getSleepSchedule = (
  {
    sleepSchedule,
    temporarilyExemptUntil,
    useDefaultUptimeSchedule,
  }: HostUptime,
  timeZone: string,
): SleepScheduleInput => {
  if (useDefaultUptimeSchedule) {
    return {
      ...defaultSleepSchedule,
      ...(temporarilyExemptUntil
        ? { temporarilyExemptUntil: new Date(temporarilyExemptUntil) }
        : {}),
      timeZone,
    };
  }

  const {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    enabledWeekdays,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    timeSelection: { runContinuously, startTime, stopTime },
  } = sleepSchedule;

  return {
    dailyStartTime: runContinuously ? "" : toTimeString(new Date(startTime)),
    dailyStopTime: runContinuously ? "" : toTimeString(new Date(stopTime)),
    permanentlyExempt: false,
    timeZone,
    shouldKeepOff: false,
    ...(temporarilyExemptUntil
      ? { temporarilyExemptUntil: new Date(temporarilyExemptUntil) }
      : {}),
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    wholeWeekdaysOff: enabledWeekdays.reduce((accum, isEnabled, i) => {
      if (!isEnabled) {
        accum.push(i);
      }
      return accum;
    }, []),
  };
};

// @ts-expect-error: FIXME. This comment was added by an automated script.
const getDailyUptime = ({ startTime, stopTime }) =>
  differenceInHours(new Date(stopTime), new Date(startTime));

const toTimeString = (date: Date): string =>
  date.toLocaleTimeString([], {
    hour: "2-digit",
    hour12: false,
    minute: "2-digit",
  });

export const defaultSleepSchedule: Optional<SleepScheduleInput, "timeZone"> = {
  dailyStartTime: toTimeString(defaultStartDate),
  dailyStopTime: toTimeString(defaultStopDate),
  permanentlyExempt: false,
  shouldKeepOff: false,
  wholeWeekdaysOff: [0, 6],
};

export const getHostUptimeFromGql = (
  sleepSchedule: Optional<SleepSchedule, "timeZone">,
): HostUptime => {
  const {
    dailyStartTime,
    dailyStopTime,
    temporarilyExemptUntil,
    wholeWeekdaysOff,
  } = sleepSchedule;

  return {
    useDefaultUptimeSchedule: matchesDefaultUptimeSchedule(sleepSchedule),
    temporarilyExemptUntil: temporarilyExemptUntil?.toString() ?? "",
    sleepSchedule: {
      enabledWeekdays: new Array(7)
        .fill(false)
        .map((_, i) => !wholeWeekdaysOff.includes(i)),
      timeSelection:
        dailyStartTime && dailyStopTime
          ? {
              startTime: parse(
                dailyStartTime,
                "HH:mm",
                // @ts-expect-error: FIXME. This comment was added by an automated script.
                new Date(null, null),
              ).toString(),
              stopTime: parse(
                dailyStopTime,
                "HH:mm",
                // @ts-expect-error: FIXME. This comment was added by an automated script.
                new Date(null, null),
              ).toString(),
              runContinuously: false,
            }
          : {
              startTime: defaultStartDate.toString(),
              stopTime: defaultStopDate.toString(),
              runContinuously: true,
            },
    },
  };
};

export const matchesDefaultUptimeSchedule = (
  sleepSchedule: Optional<SleepSchedule, "timeZone">,
): boolean => {
  const { dailyStartTime, dailyStopTime, wholeWeekdaysOff } = sleepSchedule;

  if (
    arraySymmetricDifference(
      wholeWeekdaysOff,
      defaultSleepSchedule.wholeWeekdaysOff,
    ).length > 0
  ) {
    return false;
  }
  if (dailyStartTime !== defaultSleepSchedule.dailyStartTime) return false;
  if (dailyStopTime !== defaultSleepSchedule.dailyStopTime) return false;
  return true;
};

export const validator = (({ expirationDetails }, errors) => {
  // TODO DEVPROD-6908 remove check when beta period ends
  if (isProduction()) return errors;

  const { hostUptime, noExpiration } = expirationDetails ?? {};
  if (!hostUptime || noExpiration === false) return errors;

  const { sleepSchedule, temporarilyExemptUntil, useDefaultUptimeSchedule } =
    hostUptime;

  if (temporarilyExemptUntil) {
    // LG Date Picker widget provides visual validation but doesn't provide a way to access its error state. Replicate its min/max validation here.
    const selectedDate = new Date(temporarilyExemptUntil);
    if (
      !(
        isAfter(exemptionRange.disableAfter, selectedDate) &&
        isBefore(exemptionRange.disableBefore, selectedDate)
      )
    ) {
      // @ts-expect-error
      errors.expirationDetails?.hostUptime?.temporarilyExemptUntil?.addError?.(
        "Invalid date selected; sleep can only be disabled for up to one month.",
      );
    }
  }

  const { timeSelection } = sleepSchedule ?? {};

  if (useDefaultUptimeSchedule) {
    return errors;
  }

  const { enabledHoursCount, enabledWeekdaysCount } =
    getEnabledHoursCount(hostUptime);

  if (enabledHoursCount > maxUptimeHours) {
    // Return error based on whether runContinously enabled
    if (timeSelection?.runContinuously) {
      // @ts-expect-error
      errors.expirationDetails?.hostUptime?.details?.addError?.(
        "Please pause your host for at least 1 day per week.",
      );
      return errors;
    }
    const hourlyRequirement = Math.floor(maxUptimeHours / enabledWeekdaysCount);
    // @ts-expect-error
    errors.expirationDetails?.hostUptime?.details?.addError?.(
      `Please reduce your host uptime to a max of ${hourlyRequirement} hours per day.`,
    );
    return errors;
  }

  return errors;
}) satisfies ValidateProps<{
  expirationDetails?: { hostUptime?: HostUptime; noExpiration: boolean };
}>;

/**
 * isNullSleepSchedule indicates that the sleep schedule is unset.
 * TODO: When sleep schedules are generally released, we should instead check whether noExpiration is set.
 * Until then, noExpiration is insufficient because a user may have an unexpirable host running without a sleep schedule.
 * @param sleepSchedule - sleepSchedule as returned from Evergreen
 * @returns boolean indicating whether the sleep schedule is effectively unset.
 */
export const isNullSleepSchedule = (
  sleepSchedule: Optional<SleepSchedule, "timeZone">,
) => {
  if (!sleepSchedule) return true;

  const { dailyStartTime, dailyStopTime, wholeWeekdaysOff } = sleepSchedule;
  if (dailyStartTime !== "") return false;
  if (dailyStopTime !== "") return false;
  if (arraySymmetricDifference(wholeWeekdaysOff, []).length > 0) return false;
  return true;
};

export const getNextHostStart = (
  { dailyStartTime, wholeWeekdaysOff }: SleepSchedule,
  todayDate: Date,
): {
  nextStartDay: string;
  nextStartTime: string | null;
} => {
  if (dailyStartTime) {
    const nextStartDate = parse(dailyStartTime, "HH:mm", todayDate);
    do {
      nextStartDate.setDate(nextStartDate.getDate() + 1);
    } while (wholeWeekdaysOff.includes(nextStartDate.getDay()));
    const nextStartDay: string = isTomorrow(nextStartDate)
      ? "tomorrow"
      : days[nextStartDate.getDay()];
    const nextStartTime: string = `${nextStartDate.getHours()}:${nextStartDate.getMinutes().toString().padStart(2, "0")}`;
    return { nextStartDay, nextStartTime };
  }

  const nextStartDate = todayDate;
  if (!wholeWeekdaysOff.includes(nextStartDate.getDay())) {
    // Find the next planned off day in the schedule
    do {
      nextStartDate.setDate(nextStartDate.getDate() + 1);
    } while (!wholeWeekdaysOff.includes(nextStartDate.getDay()));
  }
  // Find the first active day after that break
  do {
    nextStartDate.setDate(nextStartDate.getDate() + 1);
  } while (wholeWeekdaysOff.includes(nextStartDate.getDay()));
  const nextStartDay: string = isTomorrow(nextStartDate)
    ? "tomorrow"
    : days[nextStartDate.getDay()];
  return { nextStartDay, nextStartTime: null };
};

const today = new Date(Date.now());
export const exemptionRange = {
  disableBefore: setToUTCMidnight(today),
  disableAfter: setToUTCMidnight(
    new Date(today.setMonth(today.getMonth() + 1)),
  ),
};
