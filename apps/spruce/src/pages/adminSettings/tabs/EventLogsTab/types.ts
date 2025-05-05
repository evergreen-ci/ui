export interface EventLogsFormState {
  eventLogs: {
    title: string;
    author: string;
  };
}

export type TabProps = {
  eventLogsData: EventLogsFormState;
};
