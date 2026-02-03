import { Unpacked } from "@evg-ui/lib/types";
import { VersionTaskDurationsQuery } from "gql/generated/types";

export {
  GANTT_CHART_COLUMN_HEADERS,
  type GanttChartColumnHeaders,
  type GanttChartDataRow,
  type GanttChartData,
} from "components/GanttChart/types";

export type DateTimeRange = {
  start: Date;
  finish: Date;
  buildVariantDisplayName: string;
};

export type TaskDurationData = Unpacked<
  VersionTaskDurationsQuery["version"]["tasks"]["data"]
>;
