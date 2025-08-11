export interface EventLogEntry {
  timestamp: string;
  user: string;
  section?: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
}

export interface EventLogsFormState {
  eventLogs: {
    count: number;
    events: EventLogEntry[];
  };
}

export type TabProps = {
  eventLogsData: EventLogsFormState;
};
