import { gql } from "@apollo/client";

export const BUILD_BARON = gql`
  query BuildBaron($taskId: String!, $execution: Int!) {
    task(taskId: $taskId, execution: $execution) {
      id
      buildBaronSuggestions {
        issues {
          fields {
            assigneeDisplayName
            created
            resolutionName
            status {
              id
              name
            }
            summary
            updated
          }
          key
        }
        search
      }
      execution
    }
  }
`;
