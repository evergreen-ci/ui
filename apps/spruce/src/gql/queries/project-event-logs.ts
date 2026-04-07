import { gql } from "@apollo/client";
import { PROJECT_EVENT_SETTINGS } from "../fragments/projectSettings/projectEventSettings";

const PROJECT_EVENT_LOGS = gql`
  query ProjectEventLogs(
    $projectIdentifier: String!
    $limit: Int
    $before: Time
  ) {
    projectEvents(
      projectIdentifier: $projectIdentifier
      limit: $limit
      before: $before
    ) {
      count
      eventLogEntries {
        after {
          ...ProjectEventSettings
        }
        before {
          ...ProjectEventSettings
        }
        timestamp
        user
      }
    }
  }
  ${PROJECT_EVENT_SETTINGS}
`;

export default PROJECT_EVENT_LOGS;
