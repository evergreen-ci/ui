import { differenceInHours, parse } from "date-fns";
import { ValidateProps } from "components/SpruceForm";
import { SleepScheduleInput } from "gql/generated/types";
import { MyHost } from "types/spawn";

const daysInWeek = 7;
const hoursInDay = 24;
const defaultStartHour = 8;
const defaultStopHour = 20;
const defaultScheduleWeeklyHourCount = 60;

const suggestedUptimeHours = (daysInWeek - 2) * hoursInDay;
export const maxUptimeHours = (daysInWeek - 1) * hoursInDay;

export const defaultStartDate = new Date(null, null, null, defaultStartHour);
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
};

type ValidateInput = {
  enabledWeekdays: boolean[];
  stopTime: string;
  runContinuously: boolean;
  startTime: string;
  useDefaultUptimeSchedule: boolean;
};

export const validateUptimeSchedule = ({
  enabledWeekdays,
  runContinuously,
  startTime,
  stopTime,
  useDefaultUptimeSchedule,
}: ValidateInput): {
  enabledHoursCount: number;
  errors: string[];
  warnings: string[];
} => {
  if (useDefaultUptimeSchedule) {
    return {
      enabledHoursCount: defaultScheduleWeeklyHourCount,
      errors: [],
      warnings: [],
    };
  }

  const { enabledHoursCount, enabledWeekdaysCount } = getEnabledHoursCount({
    enabledWeekdays,
    stopTime,
    runContinuously,
    startTime,
  });

  if (enabledHoursCount > maxUptimeHours) {
    // Return error based on whether runContinously enabled
    if (runContinuously) {
      return {
        enabledHoursCount,
        errors: ["Please pause your host for at least 1 day per week."],
        warnings: [],
      };
    }
    const hourlyRequirement = Math.floor(maxUptimeHours / enabledWeekdaysCount);
    return {
      enabledHoursCount,
      errors: [
        `Please reduce your host uptime to a max of ${hourlyRequirement} hours per day.`,
      ],
      warnings: [],
    };
  }

  if (enabledHoursCount > suggestedUptimeHours) {
    // Return warning based on whether runContinuously enabled
    if (runContinuously) {
      return {
        enabledHoursCount,
        errors: [],
        warnings: ["Consider pausing your host for 2 days per week."],
      };
    }
    const hourlySuggestion = Math.floor(
      suggestedUptimeHours / enabledWeekdaysCount,
    );
    return {
      enabledHoursCount,
      errors: [],
      warnings: [
        `Consider running your host for ${hourlySuggestion} hours per day or fewer.`,
      ],
    };
  }
  // No error
  return {
    enabledHoursCount,
    errors: [],
    warnings: [],
  };
};

export const getEnabledHoursCount = ({
  enabledWeekdays,
  runContinuously,
  startTime,
  stopTime,
}: Omit<ValidateInput, "useDefaultUptimeSchedule">) => {
  const enabledWeekdaysCount =
    enabledWeekdays?.filter((day) => day).length ?? 0;
  const enabledHoursCount = runContinuously
    ? enabledWeekdaysCount * hoursInDay
    : enabledWeekdaysCount * getDailyUptime({ startTime, stopTime });
  return { enabledHoursCount, enabledWeekdaysCount };
};

export const getSleepSchedule = (
  { sleepSchedule, useDefaultUptimeSchedule }: HostUptime,
  timeZone: string,
): SleepScheduleInput => {
  if (useDefaultUptimeSchedule) {
    return {
      ...defaultSleepSchedule,
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
    wholeWeekdaysOff: enabledWeekdays.reduce((accum, isEnabled, i) => {
      if (!isEnabled) {
        accum.push(i);
      }
      return accum;
    }, []),
  };
};

const getDailyUptime = ({ startTime, stopTime }) =>
  differenceInHours(new Date(stopTime), new Date(startTime));

const toTimeString = (date: Date): string =>
  date.toLocaleTimeString([], {
    hour: "2-digit",
    hour12: false,
    minute: "2-digit",
  });

export const defaultSleepSchedule: Omit<SleepScheduleInput, "timeZone"> = {
  dailyStartTime: toTimeString(defaultStartDate),
  dailyStopTime: toTimeString(defaultStopDate),
  permanentlyExempt: false,
  // TODO: Add pause
  shouldKeepOff: false,
  wholeWeekdaysOff: [0, 6],
};

export const getHostUptimeFromGql = (
  sleepSchedule: MyHost["sleepSchedule"],
): HostUptime => {
  if (!sleepSchedule) return null;

  if (matchesDefaultUptimeSchedule(sleepSchedule)) {
    return {
      useDefaultUptimeSchedule: true,
    };
  }

  const { dailyStartTime, dailyStopTime, wholeWeekdaysOff } = sleepSchedule;

  return {
    useDefaultUptimeSchedule: false,
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
                new Date(null, null),
              ).toString(),
              stopTime: parse(
                dailyStopTime,
                "HH:mm",
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
  sleepSchedule: MyHost["sleepSchedule"],
): boolean => {
  const { dailyStartTime, dailyStopTime, wholeWeekdaysOff } = sleepSchedule;

  if (
    [...wholeWeekdaysOff].sort().toString() !==
    defaultSleepSchedule.wholeWeekdaysOff.toString()
  ) {
    return false;
  }
  if (dailyStartTime !== defaultSleepSchedule.dailyStartTime) return false;
  if (dailyStopTime !== defaultSleepSchedule.dailyStopTime) return false;
  return true;
};

export const validator = (({ expirationDetails }, errors) => {
  const { hostUptime, noExpiration } = expirationDetails ?? {};
  if (noExpiration === false) return errors;

  const { sleepSchedule, useDefaultUptimeSchedule } = hostUptime;
  const { enabledWeekdays, timeSelection } = sleepSchedule;

  if (useDefaultUptimeSchedule) {
    return errors;
  }

  const { enabledHoursCount } = getEnabledHoursCount({
    enabledWeekdays,
    ...timeSelection,
  });

  if (enabledHoursCount > maxUptimeHours) {
    errors.expirationDetails?.hostUptime?.addError("Insufficient hours");
  }

  return errors;
}) satisfies ValidateProps<{
  expirationDetails?: { hostUptime?: HostUptime; noExpiration: boolean };
}>;
