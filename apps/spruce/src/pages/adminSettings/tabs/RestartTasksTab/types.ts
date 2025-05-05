export interface RestartTasksFormState {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}

export type RestartTasksTabProps = {
  restartTasksData: RestartTasksFormState;
};
