import { AdminEventsPayload } from "gql/generated/types";
import { EventLogsFormState } from "./types";

export const gqlToForm = (
  data: AdminEventsPayload | null,
): EventLogsFormState | null => {
  if (!data) {
    return {
      eventLogs: {
        count: 0,
        events: [],
      },
    };
  }

  const { count, eventLogEntries } = data;

  return {
    eventLogs: {
      count: count ?? 0,
      events: eventLogEntries.map((entry) => ({
        timestamp: entry.timestamp.toString(),
        user: entry.user,
        section: entry.section === null ? undefined : entry.section,
        before: entry.before,
        after: entry.after,
      })),
    },
  };
};

export const formToGql = (): null => null;
