import { gql } from "@apollo/client";
import { ISSUE_LINK } from "../fragments/annotations/issueLink";

export const BUILD_BARON = gql`
  query BuildBaron(
    $taskId: String!
    $execution: Int!
    $includeCreatedTickets: Boolean!
    $includeAnnotationCreatedIssues: Boolean!
  ) {
    task(taskId: $taskId, execution: $execution) {
      id
      annotation @include(if: $includeAnnotationCreatedIssues) {
        id
        createdIssues {
          ...IssueLink
        }
      }
      buildBaronCreatedTickets @include(if: $includeCreatedTickets) {
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
  ${ISSUE_LINK}
`;
