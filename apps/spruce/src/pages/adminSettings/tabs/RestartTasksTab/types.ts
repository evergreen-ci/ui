export interface RestartTasksFormState {
  start: {
    startDate: string;
    startTime: string;
  };
  end: {
    endDate: string;
    endTime: string;
  };
  includeTasks: {
    includeTestFailed: boolean;
    includeSystemFailed: boolean;
    includeSetupFailed: boolean;
  };
}
