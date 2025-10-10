import { getUnixTime } from "date-fns";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { Requester } from "constants/requesters";
import { getHoneycombBaseURL } from "utils/environmentVariables";

/**
 * Generates a URL for accessing a trace in the Honeycomb dashboard.
 * @param traceId - The ID of the trace.
 * @param startTs - The start timestamp of the trace. Note that this timestamp is truncated to the nearest second.
 * @param endTs - The end timestamp of the trace. Note that this timestamp is rounded up to the nearest second.
 * @returns The URL for accessing the trace in the Honeycomb dashboard.
 */
export const getHoneycombTraceUrl = (
  traceId: string,
  startTs: Date,
  endTs: Date,
): string =>
  `${getHoneycombBaseURL()}/datasets/evergreen-agent/trace?trace_id=${traceId}&trace_start_ts=${getUnixTime(
    new Date(startTs),
  )}&trace_end_ts=${getUnixTime(new Date(endTs)) + 1}`;

export const getHoneycombSystemMetricsUrl = (
  taskId: string,
  diskDevices: string[],
  startTs: Date,
  endTs: Date,
): string => {
  const query = {
    calculations: [
      { op: "AVG", column: "system.memory.usage.used" },
      { op: "AVG", column: "system.cpu.utilization" },
      { op: "RATE_AVG", column: "system.network.io.transmit" },
      { op: "RATE_AVG", column: "system.network.io.receive" },
    ].concat(
      diskDevices.flatMap((device) => [
        { op: "RATE_AVG", column: `system.disk.io.${device}.read` },
        { op: "RATE_AVG", column: `system.disk.io.${device}.write` },
        { op: "RATE_AVG", column: `system.disk.operations.${device}.read` },
        {
          op: "RATE_AVG",
          column: `system.disk.operations.${device}.write`,
        },
        { op: "RATE_AVG", column: `system.disk.io_time.${device}` },
      ]),
    ),
    filters: [{ op: "=", column: "evergreen.task.id", value: taskId }],
    start_time: getUnixTime(new Date(startTs)),
    end_time: getUnixTime(new Date(endTs)),
  };

  return `${getHoneycombBaseURL()}/datasets/evergreen?query=${JSON.stringify(
    query,
  )}&omitMissingValues`;
};

// Values correspond to the column values displayed in a heatmap on Honeycomb
export enum TaskTimingMetric {
  RunTime = "duration_min",
  WaitTime = "wait_time_min",
  TotalTime = "total_time_min",
}

interface TaskTimingParams {
  buildVariant: string;
  metric: TaskTimingMetric;
  onlyCommits: boolean;
  onlySuccessful: boolean;
  projectIdentifier: string;
  taskName: string;
}

export const getHoneycombTaskTimingURL = ({
  buildVariant,
  metric,
  onlyCommits,
  onlySuccessful,
  projectIdentifier,
  taskName,
}: TaskTimingParams) => {
  const configurableFilters = [];
  if (onlyCommits) {
    configurableFilters.push({
      column: "evergreen.version.requester",
      op: "=",
      value: Requester.Gitter,
    });
  }
  if (onlySuccessful) {
    configurableFilters.push({
      column: "evergreen.task.status",
      op: "=",
      value: TaskStatus.Succeeded,
    });
  }

  const query = {
    time_range: 604800, // Default to 1 week
    granularity: 0, // 0 yields auto granularity
    calculations: [
      { op: "HEATMAP", column: metric },
      { op: "P99", column: metric },
      { op: "COUNT" },
    ],
    filters: [
      { column: "name", op: "=", value: "task" },
      {
        column: "evergreen.project.identifier",
        op: "=",
        value: projectIdentifier,
      },
      { column: "evergreen.build.name", op: "=", value: buildVariant },
      { column: "evergreen.task.name", op: "=", value: taskName },
      ...configurableFilters,

      // TODO DEVPROD-22967: This exists case can be deleted once we've been collecting activated_time metrics for 60 days.
      ...(metric !== TaskTimingMetric.RunTime
        ? [{ column: "evergreen.task.activated_time", op: "exists" }]
        : []),
    ],
    filter_combination: "AND",
    limit: 1000,
  };

  return `${getHoneycombBaseURL()}/datasets/evergreen-agent?query=${JSON.stringify(query)}&omitMissingValues`;
};
