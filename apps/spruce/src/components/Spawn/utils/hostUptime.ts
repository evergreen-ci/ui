import {
  add,
  isAfter,
  isBefore,
  differenceInHours,
  isTomorrow,
  parse,
} from "date-fns";
import { arraySymmetricDifference } from "@evg-ui/lib/utils/array";
import { ValidateProps } from "components/SpruceForm";
import { days } from "constants/time";
import { SleepSchedule, SleepScheduleInput } from "gql/generated/types";
import { FormState as EditFormState } from "../editHostModal";
import { FormState as SpawnFormState } from "../spawnHostModal";

const daysInWeek = 7;
const hoursInDay = 24;
const defaultStartHour = 8;
const defaultStopHour = 20;
const defaultScheduleWeeklyHourCount = 60;
const defaultScheduleWeekdaysCount = 5;

const suggestedUptimeHours = (daysInWeek - 2) * hoursInDay;
export const maxUptimeHours = (daysInWeek - 1) * hoursInDay;

export const defaultStartDate = new Date(0, 0, 0, defaultStartHour);
export const defaultStopDate = new Date(0, 0, 0, defaultStopHour);

export type HostUptime = {
  useDefaultUptimeSchedule: boolean;
  sleepSchedule: {
    enabledWeekdays: boolean[];
    timeSelection: {
      startTime: string;
      stopTime: string;
      runContinuously: boolean;
    };
  };
  details: {
    timeZone: string;
    uptimeHours?: null;
  };
  temporarilyExemptUntil?: string;
};

type ValidateInput = {
  enabledHoursCount: number;
  enabledWeekdaysCount: number;
  runContinuously: boolean;
};

/**
 * getHostUptimeWarnings returns warning strings based on the host uptime configuration
 * @param obj - host uptime configuration fields
 * @param obj.enabledHoursCount - total weekly count of active host hours
 * @param obj.enabledWeekdaysCount - number of days per week the host is enabled
 * @param obj.runContinuously - boolean indicating whether the host runs overnight
 * @returns - A string array with warning text
 */
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

/**
 * getEnabledHoursCount calculates the hours and days per week that a host is configured to run
 * @param hostUptime - host uptime schedule as configured by the spawn or edit hos tmodal
 * @returns - object with enabledHoursCount indicating total hours per week and enabledWeekdaysCount indicating number of days per week
 */
export const getEnabledHoursCount = (
  hostUptime?: HostUptime,
): { enabledHoursCount: number; enabledWeekdaysCount: number } => {
  if (!hostUptime) {
    return {
      enabledHoursCount: defaultScheduleWeeklyHourCount,
      enabledWeekdaysCount: defaultScheduleWeekdaysCount,
    };
  }

  const {
    sleepSchedule: {
      enabledWeekdays,
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
    enabledWeekdays?.filter((day: boolean) => day).length ?? 0;
  const enabledHoursCount = runContinuously
    ? enabledWeekdaysCount * hoursInDay
    : enabledWeekdaysCount * getDailyUptime({ startTime, stopTime });
  return { enabledHoursCount, enabledWeekdaysCount };
};

/**
 * getSleepSchedule converts form object into GraphQL input type
 * @param obj - form data object
 * @param obj.sleepSchedule - sleep schedule configuration
 * @param obj.temporarilyExemptUntil - temporary exemption date
 * @param obj.useDefaultUptimeSchedule - boolean indicating whether user has set custom schedule
 * @param obj.details - details form object
 * @param obj.details.timeZone - user-selected time zone
 * @returns - sleep schedule used as input for GraphQL mutations
 */
export const getSleepSchedule = ({
  details: { timeZone },
  sleepSchedule,
  temporarilyExemptUntil,
  useDefaultUptimeSchedule,
}: HostUptime): SleepScheduleInput => {
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
    enabledWeekdays,
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
    wholeWeekdaysOff: enabledWeekdays.reduce(
      (accum: number[], isEnabled: boolean, i: number) => {
        if (!isEnabled) {
          accum.push(i);
        }
        return accum;
      },
      [],
    ),
  };
};

const getDailyUptime = ({
  startTime,
  stopTime,
}: {
  startTime: string;
  stopTime: string;
}) => {
  const startDate = new Date(startTime);
  const stopDate = new Date(stopTime);

  // If this is an overnight schedule, set stop date to the following day so that uptime is correctly calculated.
  if (stopDate < startDate) {
    stopDate.setDate(stopDate.getDate() + 1);
  }

  return differenceInHours(stopDate, startDate);
};

const toTimeString = (date: Date): string =>
  date.toLocaleTimeString([], {
    hour: "2-digit",
    hour12: false,
    minute: "2-digit",
  });

export const defaultSleepSchedule: Omit<SleepSchedule, "timeZone"> = {
  dailyStartTime: toTimeString(defaultStartDate),
  dailyStopTime: toTimeString(defaultStopDate),
  permanentlyExempt: false,
  shouldKeepOff: false,
  wholeWeekdaysOff: [0, 6],
};

export const getHostUptimeFromGql = (
  sleepSchedule: SleepSchedule,
): HostUptime => {
  const {
    dailyStartTime,
    dailyStopTime,
    temporarilyExemptUntil,
    timeZone,
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
                new Date(0, 0),
              ).toString(),
              stopTime: parse(
                dailyStopTime,
                "HH:mm",
                new Date(0, 0),
              ).toString(),
              runContinuously: false,
            }
          : {
              startTime: defaultStartDate.toString(),
              stopTime: defaultStopDate.toString(),
              runContinuously: true,
            },
    },
    details: { timeZone },
  };
};

export const matchesDefaultUptimeSchedule = (
  sleepSchedule: SleepSchedule,
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

export const validator = (permanentlyExempt: boolean) =>
  (({ expirationDetails }, errors) => {
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
        // @ts-expect-error - It doesn't hugely matter where the error is appended
        errors.expirationDetails?.hostUptime?.temporarilyExemptUntil?.addError?.(
          "Invalid date selected; sleep can only be disabled for up to one month.",
        );
      }
    }

    if (
      !isSleepScheduleActive({
        isTemporarilyExempt: !!temporarilyExemptUntil,
        noExpiration: !!noExpiration,
        permanentlyExempt,
      })
    ) {
      return errors;
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
        // @ts-expect-error - It doesn't hugely matter where the error is appended
        errors.expirationDetails?.hostUptime?.details?.uptimeHours?.addError?.(
          "Please pause your host for at least 1 day per week.",
        );
        return errors;
      }
      const hourlyRequirement = Math.floor(
        maxUptimeHours / enabledWeekdaysCount,
      );
      // @ts-expect-error - It doesn't hugely matter where the error is appended
      errors.expirationDetails?.hostUptime?.details?.uptimeHours?.addError?.(
        `Please reduce your host uptime to a max of ${hourlyRequirement} hours per day.`,
      );
      return errors;
    }

    return errors;
  }) satisfies ValidateProps<EditFormState | SpawnFormState>;

/**
 * isNullSleepSchedule indicates that the sleep schedule is unset.
 * TODO: When sleep schedules are generally released, we should instead check whether noExpiration is set.
 * Until then, noExpiration is insufficient because a user may have an unexpirable host running without a sleep schedule.
 * @param sleepSchedule - sleepSchedule as returned from Evergreen
 * @returns boolean indicating whether the sleep schedule is effectively unset.
 */
export const isNullSleepSchedule = (sleepSchedule: SleepSchedule) => {
  if (!sleepSchedule) return true;

  const { dailyStartTime, dailyStopTime, wholeWeekdaysOff } = sleepSchedule;
  if (dailyStartTime !== "") return false;
  if (dailyStopTime !== "") return false;
  if (arraySymmetricDifference(wholeWeekdaysOff, []).length > 0) return false;
  return true;
};

export const isSleepScheduleActive = ({
  isTemporarilyExempt,
  noExpiration,
  permanentlyExempt,
}: {
  isTemporarilyExempt: boolean;
  noExpiration: boolean;
  permanentlyExempt: boolean;
}) => {
  if (!noExpiration) return false;
  if (isTemporarilyExempt) return false;
  if (permanentlyExempt) return false;
  return true;
};

/**
 * getNextHostStart returns strings representing the next time a host will start as computed using the server-returned timestamp.
 * @param dailyStartTime - hourly time that the host will wake from sleep. Empty string indicates the host runs continuously on enabled days.
 * @param nextStart - Date string from the server indiciating the next start.
 * @returns object with nextStartDay and nextStartTime strings. Either/both values are null if the server does not specify a time.
 */
export const getNextHostStart = (
  dailyStartTime: string,
  nextStart: string,
): {
  nextStartDay: string | null;
  nextStartTime: string | null;
} => {
  if (!nextStart) {
    return { nextStartDay: null, nextStartTime: null };
  }

  const nextStartDate = new Date(nextStart);
  return {
    nextStartDay: isTomorrow(nextStartDate)
      ? "tomorrow"
      : days[nextStartDate.getDay()],
    nextStartTime: dailyStartTime
      ? `${nextStartDate.getHours()}:${nextStartDate.getMinutes().toString().padStart(2, "0")}`
      : null,
  };
};

const today = new Date();

export const exemptionRange = {
  disableBefore: today,
  disableAfter: add(today, { months: 1 }),
};
