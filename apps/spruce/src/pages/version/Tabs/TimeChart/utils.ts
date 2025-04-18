import {
  GANTT_CHART_COLUMN_HEADERS,
  GanttChartData,
  GanttChartDataRow,
  VersionGanttChartData,
  TaskDurationData,
} from "./types";

export const transformVersionDataToVariantGanttChartData = (
  data?: VersionGanttChartData,
): GanttChartData => {
  const { version } = data || {};
  const { buildVariants } = version || {};

  const chartData: GanttChartDataRow[] =
    buildVariants?.reduce((acc: GanttChartDataRow[], variant) => {
      const startTime = new Date(
        Math.min(
          ...(variant.tasks || []).reduce((startTimes: number[], task) => {
            if (task.startTime) {
              startTimes.push(new Date(task.startTime).getTime());
            }
            return startTimes;
          }, []),
        ),
      );
      const endTime = new Date(
        Math.max(
          ...(variant.tasks || []).reduce((finishTimes: number[], task) => {
            if (task.finishTime) {
              finishTimes.push(new Date(task.finishTime).getTime());
            }
            return finishTimes;
          }, []),
        ),
      );

      if (isNaN(startTime.valueOf()) || isNaN(endTime.valueOf())) {
        return acc;
      }

      const duration = endTime.getTime() - startTime.getTime();

      acc.push([
        variant.displayName,
        variant.displayName,
        "",
        startTime,
        endTime,
        duration,
        100,
        null,
      ]);

      return acc;
    }, []) || [];

  return [GANTT_CHART_COLUMN_HEADERS, ...chartData];
};

export const transformVersionDataToTaskGanttChartData = (
  data?: TaskDurationData[],
): GanttChartData => {
  const chartDataRows = (data || []).reduce(
    (acc: GanttChartDataRow[], task) => {
      const { displayName, finishTime, startTime } = task;
      if (!finishTime || !startTime) {
        return acc;
      }

      acc.push([
        displayName,
        displayName,
        "",
        new Date(startTime),
        new Date(finishTime),
        null,
        100,
        null,
      ]);

      return acc;
    },
    [],
  );

  return [GANTT_CHART_COLUMN_HEADERS, ...chartDataRows];
};
