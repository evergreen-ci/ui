import { TaskStatus } from "types/task";

type LogkeeperTestResult = {
  id: string;
  name: string;
  groupID?: string;
};

type EvergreenTestResult = {
  id: string;
  testFile: string;
  groupID?: string;
  logs?: {
    urlParsley?: string;
  };
};

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
