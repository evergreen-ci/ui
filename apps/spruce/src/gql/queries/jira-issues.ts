import { gql } from "@apollo/client";
import { ISSUE_LINK } from "../fragments/annotations/issueLink";

export const JIRA_ISSUES = gql`
  query Issues($taskId: String!, $execution: Int) {
    task(taskId: $taskId, execution: $execution) {
      id
      annotation {
        id
        issues {
          ...IssueLink
        }
      }
      execution
    }
  }
  ${ISSUE_LINK}
`;
