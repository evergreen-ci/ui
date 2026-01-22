import { TaskEventLogEntry, LogMessageFragment } from "gql/generated/types";

export interface TaskEventLogEntryType extends TaskEventLogEntry {
  kind?: "taskEventLogEntry";
}

export interface LogMessageType extends LogMessageFragment {
  kind?: "logMessage";
}

export interface Props {
  setNoLogs: (noLogs: boolean) => void;
}
