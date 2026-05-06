import { gql } from "@apollo/client";

export const ADMIN_EVENT_LOG = gql`
  query AdminEvents($opts: AdminEventsInput!) {
    adminEvents(opts: $opts) {
      count
      eventLogEntries {
        after
        before
        section
        timestamp
        user
      }
    }
  }
`;
