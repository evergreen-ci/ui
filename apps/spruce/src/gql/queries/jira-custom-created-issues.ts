import { gql } from "@apollo/client";
import { ISSUE_LINK } from "../fragments/annotations/issueLink";

export const JIRA_CUSTOM_CREATED_ISSUES = gql`
  query CustomCreatedIssues($taskId: String!, $execution: Int) {
    task(taskId: $taskId, execution: $execution) {
      id
      annotation {
        id
        createdIssues {
          ...IssueLink
        }
      }
      execution
    }
  }
  ${ISSUE_LINK}
`;
