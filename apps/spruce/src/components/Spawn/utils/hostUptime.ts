import { arraySymmetricDifference } from "@evg-ui/lib/utils/array";
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
import { SleepScheduleInput } from "gql/generated/types";
import { Optional } from "types/utils";
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
  details?: null;
  isBetaTester: boolean;
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

export const getSleepSchedule = (
  {
    isBetaTester,
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
      isBetaTester,
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
    isBetaTester,
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
}) => differenceInHours(new Date(stopTime), new Date(startTime));

const toTimeString = (date: Date): string =>
  date.toLocaleTimeString([], {
    hour: "2-digit",
    hour12: false,
    minute: "2-digit",
  });

type RequiredSleepSchedule = Optional<SleepScheduleInput, "timeZone">;

export const defaultSleepSchedule: RequiredSleepSchedule = {
  dailyStartTime: toTimeString(defaultStartDate),
  dailyStopTime: toTimeString(defaultStopDate),
  permanentlyExempt: false,
  shouldKeepOff: false,
  wholeWeekdaysOff: [0, 6],
};

export const getHostUptimeFromGql = (
  sleepSchedule: RequiredSleepSchedule,
): HostUptime => {
  const {
    dailyStartTime,
    dailyStopTime,
    isBetaTester,
    temporarilyExemptUntil,
    wholeWeekdaysOff,
  } = sleepSchedule;

  return {
    useDefaultUptimeSchedule: matchesDefaultUptimeSchedule(sleepSchedule),
    temporarilyExemptUntil: temporarilyExemptUntil?.toString() ?? "",
    isBetaTester: !!isBetaTester,
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
  };
};

export const matchesDefaultUptimeSchedule = (
  sleepSchedule: RequiredSleepSchedule,
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
        // @ts-expect-error
        errors.expirationDetails?.hostUptime?.temporarilyExemptUntil?.addError?.(
          "Invalid date selected; sleep can only be disabled for up to one month.",
        );
      }
    }

    if (
      !isSleepScheduleActive({
        // Set true because we to validate sleep schedule regardless of whether user is enabling it
        isBetaTester: true,
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
        // @ts-expect-error
        errors.expirationDetails?.hostUptime?.details?.addError?.(
          "Please pause your host for at least 1 day per week.",
        );
        return errors;
      }
      const hourlyRequirement = Math.floor(
        maxUptimeHours / enabledWeekdaysCount,
      );
      // @ts-expect-error
      errors.expirationDetails?.hostUptime?.details?.addError?.(
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
export const isNullSleepSchedule = (sleepSchedule: RequiredSleepSchedule) => {
  if (!sleepSchedule) return true;

  const { dailyStartTime, dailyStopTime, wholeWeekdaysOff } = sleepSchedule;
  if (dailyStartTime !== "") return false;
  if (dailyStopTime !== "") return false;
  if (arraySymmetricDifference(wholeWeekdaysOff, []).length > 0) return false;
  return true;
};

export const isSleepScheduleActive = ({
  isBetaTester,
  isTemporarilyExempt,
  noExpiration,
  permanentlyExempt,
}: {
  isBetaTester: boolean;
  isTemporarilyExempt: boolean;
  noExpiration: boolean;
  permanentlyExempt: boolean;
}) => {
  if (!isBetaTester) return false;
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

const today = new Date(Date.now());
export const exemptionRange = {
  disableBefore: setToUTCMidnight(today),
  disableAfter: setToUTCMidnight(
    new Date(today.setMonth(today.getMonth() + 1)),
  ),
};
