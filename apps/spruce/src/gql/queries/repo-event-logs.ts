import { gql } from "@apollo/client";
import { PROJECT_EVENT_SETTINGS } from "../fragments/projectSettings/projectEventSettings";

const REPO_EVENT_LOGS = gql`
  query RepoEventLogs($repoId: String!, $limit: Int, $before: Time) {
    repoEvents(repoId: $repoId, limit: $limit, before: $before) {
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

export default REPO_EVENT_LOGS;
