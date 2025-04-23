import { Unpacked } from "@evg-ui/lib/types/utils";
import { VersionTaskDurationsQuery } from "gql/generated/types";

type GanttChartColumnHeader = {
  type: "string" | "date" | "number";
  label: string;
};

export type DateTimeRange = {
  start: Date;
  finish: Date;
  buildVariantDisplayName: string;
};

type GanttChartColumnHeaders = [
  GanttChartColumnHeader,
  GanttChartColumnHeader,
  GanttChartColumnHeader,
  GanttChartColumnHeader,
  GanttChartColumnHeader,
  GanttChartColumnHeader,
  GanttChartColumnHeader,
  GanttChartColumnHeader,
];

export type GanttChartDataRow = [
  string,
  string,
  string | null,
  Date,
  Date,
  number | null,
  number,
  string | null,
];

export type TaskDurationData = Unpacked<
  VersionTaskDurationsQuery["version"]["tasks"]["data"]
>;

export type GanttChartData = [GanttChartColumnHeaders, ...GanttChartDataRow[]];

export const GANTT_CHART_COLUMN_HEADERS: GanttChartColumnHeaders = [
  { type: "string", label: "Task ID" },
  { type: "string", label: "Task Name" },
  { type: "string", label: "Resource" },
  { type: "date", label: "Start Date" },
  { type: "date", label: "End Date" },
  { type: "number", label: "Duration" },
  { type: "number", label: "Percent Complete" },
  { type: "string", label: "Dependencies" },
];
