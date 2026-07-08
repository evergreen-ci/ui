import { getUnixTime } from "date-fns";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { mainlineRequesters, Requester } from "constants/requesters";
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
  `${getHoneycombBaseURL()}/datasets/evergreen-agent/trace?trace_id=${traceId}&trace_start_ts=${getUnixTime(startTs)}&trace_end_ts=${getUnixTime(endTs) + 1}`;

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
    start_time: getUnixTime(startTs),
    end_time: getUnixTime(endTs),
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

const buildHoneycombStatUrl = (
  dataset: string,
  query: { calculations: unknown[] },
) => {
  const columnSeriesParams = query.calculations
    .map((_, i) => `cstype_${i}=stat`)
    .join("&");
  return `${getHoneycombBaseURL()}/datasets/${dataset}?query=${JSON.stringify(query)}&${columnSeriesParams}`;
};

/**
 * Generates a URL for viewing the cost breakdown of a task in Honeycomb.
 * @param taskId - The ID of the task.
 * @param startTs - The start timestamp of the task. Note that this timestamp is truncated to the nearest second.
 * @param endTs - The end timestamp of the task. Note that 300 seconds are added to this timestamp to account for S3 data-arrival lag.
 * @returns The URL for viewing the task cost breakdown in Honeycomb.
 */
export const getHoneycombTaskCostUrl = (
  taskId: string,
  startTs: Date,
  endTs: Date,
): string => {
  const query = {
    calculations: [
      { op: "MAX", column: "evergreen.task.adjusted_cost" },
      { op: "MAX", column: "evergreen.task.on_demand_cost" },
      {
        op: "MAX",
        column: "evergreen.task.s3_cost.adjusted_artifact_put_cost",
      },
      {
        op: "MAX",
        column: "evergreen.task.s3_cost.on_demand_artifact_put_cost",
      },
      { op: "MAX", column: "evergreen.task.s3_cost.adjusted_log_put_cost" },
      { op: "MAX", column: "evergreen.task.s3_cost.on_demand_log_put_cost" },
      {
        op: "MAX",
        column: "evergreen.task.s3_cost.adjusted_artifact_storage_cost",
      },
      {
        op: "MAX",
        column: "evergreen.task.s3_cost.on_demand_artifact_storage_cost",
      },
      {
        op: "MAX",
        column: "evergreen.task.s3_cost.adjusted_log_storage_cost",
      },
      {
        op: "MAX",
        column: "evergreen.task.s3_cost.on_demand_log_storage_cost",
      },
      {
        op: "MAX",
        column: "evergreen.task.s3_cost.artifact_put_requests",
      },
      {
        op: "MAX",
        column: "evergreen.task.s3_cost.artifact_upload_bytes",
      },
      { op: "MAX", column: "evergreen.task.s3_cost.log_put_requests" },
      { op: "MAX", column: "evergreen.task.s3_cost.log_upload_bytes" },
    ],
    filters: [{ op: "=", column: "evergreen.task.id", value: taskId }],
    start_time: getUnixTime(startTs),
    end_time: getUnixTime(endTs) + 300,
  };

  return buildHoneycombStatUrl("evergreen", query);
};

/**
 * Generates a URL for viewing the cost breakdown of a version in Honeycomb.
 * @param versionId - The ID of the version.
 * @param startTs - The start timestamp of the version. Note that this timestamp is truncated to the nearest second.
 * @param endTs - The end timestamp of the version. Note that 300 seconds are added to this timestamp to account for S3 data-arrival lag.
 * @returns The URL for viewing the version cost breakdown in Honeycomb.
 */
export const getHoneycombVersionCostUrl = (
  versionId: string,
  startTs: Date,
  endTs: Date,
): string => {
  const query = {
    calculations: [
      { op: "MAX", column: "evergreen.version.adjusted_cost" },
      { op: "MAX", column: "evergreen.version.on_demand_cost" },
      {
        op: "MAX",
        column: "evergreen.version.s3_cost.adjusted_artifact_put_cost",
      },
      {
        op: "MAX",
        column: "evergreen.version.s3_cost.on_demand_artifact_put_cost",
      },
      {
        op: "MAX",
        column: "evergreen.version.s3_cost.adjusted_log_put_cost",
      },
      {
        op: "MAX",
        column: "evergreen.version.s3_cost.on_demand_log_put_cost",
      },
      {
        op: "MAX",
        column: "evergreen.version.s3_cost.adjusted_artifact_storage_cost",
      },
      {
        op: "MAX",
        column: "evergreen.version.s3_cost.on_demand_artifact_storage_cost",
      },
      {
        op: "MAX",
        column: "evergreen.version.s3_cost.adjusted_log_storage_cost",
      },
      {
        op: "MAX",
        column: "evergreen.version.s3_cost.on_demand_log_storage_cost",
      },
      {
        op: "MAX",
        column: "evergreen.version.s3_cost.artifact_put_requests",
      },
      {
        op: "MAX",
        column: "evergreen.version.s3_cost.artifact_upload_bytes",
      },
      { op: "MAX", column: "evergreen.version.s3_cost.log_put_requests" },
      { op: "MAX", column: "evergreen.version.s3_cost.log_upload_bytes" },
    ],
    filters: [{ op: "=", column: "evergreen.version.id", value: versionId }],
    start_time: getUnixTime(startTs),
    end_time: getUnixTime(endTs) + 300,
  };

  return buildHoneycombStatUrl("evergreen", query);
};

const ONE_WEEK_IN_SECONDS = 604800;

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
    time_range: ONE_WEEK_IN_SECONDS,
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
    ],
    filter_combination: "AND",
    limit: 1000,
  };

  return `${getHoneycombBaseURL()}/datasets/evergreen-agent?query=${JSON.stringify(query)}&omitMissingValues`;
};

export const getHoneycombHistoryUrl = ({
  bvName,
  isDisplayTask,
  projectId,
  requester,
  taskName,
}: {
  bvName: string;
  projectId: string;
  taskName: string;
  requester: string;
  isDisplayTask: boolean;
}) => {
  const query = {
    time_range: ONE_WEEK_IN_SECONDS,
    granularity: 0,
    calculations: [{ op: "COUNT" }],
    filters: [
      { column: "name", op: "=", value: "task" },
      {
        column: "evergreen.project.id",
        op: "=",
        value: projectId,
      },
      {
        column: "evergreen.version.requester",
        op: "in",
        value: [requester, ...mainlineRequesters],
      },
      {
        column: "evergreen.build.name",
        op: "=",
        value: bvName,
      },
      {
        column: isDisplayTask
          ? "evergreen.display_task.name"
          : "evergreen.task.name",
        op: "=",
        value: taskName,
      },
    ],
    breakdowns: ["evergreen.task.status", "evergreen.version.requester"],
    filter_combination: "AND",
    limit: 1000,
  };
  return `${getHoneycombBaseURL()}/datasets/evergreen-agent?query=${JSON.stringify(query)}&omitMissingValues`;
};
