import { differenceInHours, parse } from "date-fns";
import { SleepScheduleInput } from "gql/generated/types";
import { MyHost } from "types/spawn";

const daysInWeek = 7;
const hoursInDay = 24;
const maxUptimeHours = (daysInWeek - 1) * hoursInDay;
const suggestedUptimeHours = (daysInWeek - 2) * hoursInDay;
const defaultStartHour = 8;
const defaultStopHour = 20;
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

interface GetNoExpirationCheckboxTooltipCopyProps {
  disableExpirationCheckbox: boolean;
  isVolume: boolean;
  limit: number;
}

export const getNoExpirationCheckboxTooltipCopy = ({
  disableExpirationCheckbox,
  isVolume,
  limit,
}: GetNoExpirationCheckboxTooltipCopyProps) =>
  disableExpirationCheckbox
    ? `You have reached the max number of unexpirable ${
        isVolume ? "volumes" : "hosts"
      }  (${limit}). Toggle an existing ${
        isVolume ? "volume" : "host"
      } to expirable to enable this checkbox.`
    : undefined;

export const getDefaultExpiration = () => {
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  return nextWeek.toString();
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
  const { enabledHoursCount, enabledWeekdaysCount } = getEnabledHoursCount({
    enabledWeekdays,
    stopTime,
    runContinuously,
    startTime,
  });

  if (useDefaultUptimeSchedule) {
    return {
      enabledHoursCount,
      errors: [],
      warnings: [],
    };
  }

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

const getEnabledHoursCount = ({
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

const getDailyUptime = ({ startTime, stopTime }) =>
  differenceInHours(new Date(stopTime), new Date(startTime));

export const getSleepSchedule = (
  { sleepSchedule, useDefaultUptimeSchedule }: HostUptime,
  timeZone: string,
): SleepScheduleInput => {
  if (useDefaultUptimeSchedule) {
    return getDefaultSleepSchedule({ timeZone });
  }

  const {
    enabledWeekdays,
    timeSelection: { runContinuously, startTime, stopTime },
  } = sleepSchedule;

  const schedule: SleepScheduleInput = {
    dailyStartTime: "",
    dailyStopTime: "",
    permanentlyExempt: false,
    shouldKeepOff: false,
    timeZone,
    wholeWeekdaysOff: enabledWeekdays.reduce((accum, isEnabled, i) => {
      if (!isEnabled) {
        accum.push(i);
      }
      return accum;
    }, []),
  };

  if (!runContinuously) {
    const startDate = new Date(startTime);
    const stopDate = new Date(stopTime);
    schedule.dailyStartTime = toTimeString(startDate);
    schedule.dailyStopTime = toTimeString(stopDate);
  }

  return schedule;
};

const toTimeString = (date: Date): string =>
  date.toLocaleTimeString([], {
    hour: "2-digit",
    hour12: false,
    minute: "2-digit",
  });

const getDefaultSleepSchedule = ({ timeZone }): SleepScheduleInput => {
  const sleepSchedule: SleepScheduleInput = {
    dailyStartTime: toTimeString(defaultStartDate),
    dailyStopTime: toTimeString(defaultStopDate),
    permanentlyExempt: false,
    // TODO: Add pause
    shouldKeepOff: false,
    timeZone,
    wholeWeekdaysOff: [0, 6],
  };

  return sleepSchedule;
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
              startTime: parse(dailyStartTime, "HH:mm", new Date()).toString(),
              stopTime: parse(dailyStopTime, "HH:mm", new Date()).toString(),
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

const matchesDefaultUptimeSchedule = (
  sleepSchedule: MyHost["sleepSchedule"],
): boolean => {
  const { dailyStartTime, dailyStopTime, wholeWeekdaysOff } = sleepSchedule;

  if (
    [...wholeWeekdaysOff].sort().toString() !== new Array([0, 6]).toString()
  ) {
    return false;
  }
  if (dailyStartTime !== "08:00") return false;
  if (dailyStopTime !== "20:00") return false;
  return true;
};
