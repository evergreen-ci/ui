import { gql } from "@apollo/client";

const BUILD_BARON = gql`
  query BuildBaron($taskId: String!, $execution: Int!) {
    buildBaron(taskId: $taskId, execution: $execution) {
      bbTicketCreationDefined
      buildBaronConfigured
      searchReturnInfo {
        featuresURL
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
        source
      }
    }
  }
`;

export default BUILD_BARON;
