import { differenceInHours } from "date-fns";

const daysInWeek = 7;
const hoursInDay = 24;
export const maxUptimeHours = (daysInWeek - 1) * hoursInDay;
const suggestedUptimeHours = (daysInWeek - 2) * hoursInDay;

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
  endTime: string;
  runContinuously: boolean;
  startTime: string;
  useDefaultUptimeSchedule: boolean;
};

export const validateUptimeSchedule = ({
  enabledWeekdays,
  endTime,
  runContinuously,
  startTime,
  useDefaultUptimeSchedule,
}: ValidateInput): {
  enabledHoursCount: number;
  errors: string[];
  warnings: string[];
} => {
  const { enabledHoursCount, enabledWeekdaysCount } = getEnabledHoursCount({
    enabledWeekdays,
    endTime,
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
  endTime,
  runContinuously,
  startTime,
}: Omit<ValidateInput, "useDefaultUptimeSchedule">) => {
  const enabledWeekdaysCount =
    enabledWeekdays?.filter((day) => day).length ?? 0;
  const enabledHoursCount = runContinuously
    ? enabledWeekdaysCount * hoursInDay
    : enabledWeekdaysCount * getDailyUptime({ startTime, endTime });
  return { enabledHoursCount, enabledWeekdaysCount };
};

const getDailyUptime = ({ endTime, startTime }) =>
  differenceInHours(new Date(endTime), new Date(startTime));
