type LogkeeperTestResult = {
  id: string;
  name: string;
  groupID?: string;
};

type EvergreenTestResult = {
  id: string;
  testFile: string;
  groupID?: string;
  logs: {
    urlParsley: string;
  };
};

type JobLogsTableTestResult = LogkeeperTestResult | EvergreenTestResult;

export type {
  JobLogsTableTestResult,
  LogkeeperTestResult,
  EvergreenTestResult,
};
