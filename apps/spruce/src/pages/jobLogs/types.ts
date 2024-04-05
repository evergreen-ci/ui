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
  allLogsURL?: string;
  builder?: string;
  buildId?: string;
  buildNum?: number;
  displayName?: string;
  groupID?: string;
  isLogkeeper: boolean;
  taskStatus?: TaskStatus;
};
type JobLogsTableTestResult = LogkeeperTestResult | EvergreenTestResult;

export type {
  JobLogsTableTestResult,
  LogkeeperTestResult,
  EvergreenTestResult,
  JobLogsMetadata,
};
