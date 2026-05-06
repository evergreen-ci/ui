import { TaskStatus } from "@evg-ui/lib/types/task";
import { Unpacked } from "@evg-ui/lib/types/utils";
import { TaskTestsForJobLogsQuery } from "gql/generated/types";

type EvergreenTestResult = Unpacked<
  NonNullable<TaskTestsForJobLogsQuery["task"]>["tests"]["testResults"]
>;

type JobLogsMetadata = {
  completeLogsURL: string;
  displayName?: string;
  execution: number;
  groupID?: string;
  taskId: string;
  taskStatus?: TaskStatus;
};

export type { EvergreenTestResult, JobLogsMetadata };
