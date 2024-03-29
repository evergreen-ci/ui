type LogkeeperTestResult = {
  id: string;
  name: string;
  groupID?: string;
};

type EvergreenTestResult = {
  id: string;
  testFile: string;
  groupID?: string;
};

type JobLogsTableTestResult = LogkeeperTestResult | EvergreenTestResult;

export type {
  JobLogsTableTestResult,
  LogkeeperTestResult,
  EvergreenTestResult,
};
