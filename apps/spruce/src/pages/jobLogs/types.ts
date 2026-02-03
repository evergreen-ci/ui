import { TaskStatus, Unpacked } from "@evg-ui/lib/types";
import {
  LogkeeperBuildMetadataQuery,
  TaskTestsForJobLogsQuery,
} from "gql/generated/types";

type LogkeeperTestResult = Unpacked<
  LogkeeperBuildMetadataQuery["logkeeperBuildMetadata"]["tests"]
>;

type EvergreenTestResult = Unpacked<
  NonNullable<TaskTestsForJobLogsQuery["task"]>["tests"]["testResults"]
>;

type JobLogsMetadata = {
  completeLogsURL: string;
  builder?: string;
  buildId?: string;
  buildNum?: number;
  displayName?: string;
  execution: number;
  groupID?: string;
  isLogkeeper: boolean;
  taskId: string;
  taskStatus?: TaskStatus;
};
type JobLogsTableTestResult = LogkeeperTestResult | EvergreenTestResult;

export type {
  JobLogsTableTestResult,
  LogkeeperTestResult,
  EvergreenTestResult,
  JobLogsMetadata,
};
