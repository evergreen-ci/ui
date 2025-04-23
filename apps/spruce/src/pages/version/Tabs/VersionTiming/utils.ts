import {
  GANTT_CHART_COLUMN_HEADERS,
  GanttChartData,
  GanttChartDataRow,
  TaskDurationData,
  DateTimeRange,
} from "./types";

export const transformTaskDurationDataToTaskGanttChartData = (
  data?: TaskDurationData[],
): GanttChartData => {
  const chartDataRows = (data || []).reduce(
    (acc: GanttChartDataRow[], task) => {
      const { buildVariant, displayName, finishTime, id, startTime } = task;
      if (!finishTime || !startTime) {
        return acc;
      }

      console.log("id", id);

      acc.push([
        // `${buildVariant}.${displayName}`,
        id,
        displayName,
        buildVariant,
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

export const transformTaskDurationDataToVariantGanttChartData = (
  data?: TaskDurationData[],
): GanttChartData => {
  const variantsWithStartAndFinishTimes = (data || []).reduce<{
    [key: string]: DateTimeRange;
  }>((acc, task) => {
    const { buildVariant, buildVariantDisplayName, finishTime, startTime } =
      task;

    if (!finishTime || !startTime) {
      return acc;
    }

    if (!acc[buildVariant]) {
      acc[buildVariant] = {
        start: new Date(startTime),
        finish: new Date(finishTime),
        buildVariantDisplayName: buildVariantDisplayName || "",
      };
      return acc;
    }

    acc[buildVariant].start = new Date(
      Math.min(
        acc[buildVariant].start.getTime(),
        new Date(startTime).getTime(),
      ),
    );
    acc[buildVariant].finish = new Date(
      Math.max(
        acc[buildVariant].finish.getTime(),
        new Date(finishTime).getTime(),
      ),
    );

    return acc;
  }, {});

  const chartDataRows: GanttChartDataRow[] = Object.entries(
    variantsWithStartAndFinishTimes,
  ).map(([key, value]) => [
    key,
    value.buildVariantDisplayName,
    "",
    value.start,
    value.finish,
    null,
    100,
    null,
  ]);
  return [GANTT_CHART_COLUMN_HEADERS, ...chartDataRows];
};
