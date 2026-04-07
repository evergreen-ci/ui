import { gql } from "@apollo/client";
import { ISSUE_LINK } from "../fragments/annotations/issueLink";

const JIRA_SUSPECTED_ISSUES = gql`
  query SuspectedIssues($taskId: String!, $execution: Int) {
    task(taskId: $taskId, execution: $execution) {
      id
      annotation {
        id
        suspectedIssues {
          ...IssueLink
        }
      }
      execution
    }
  }
  ${ISSUE_LINK}
`;

export default JIRA_SUSPECTED_ISSUES;
