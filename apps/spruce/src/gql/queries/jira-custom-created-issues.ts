import { gql } from "@apollo/client";
import { ISSUE_LINK } from "../fragments/annotations/issueLink";

const JIRA_CUSTOM_CREATED_ISSUES = gql`
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

export default JIRA_CUSTOM_CREATED_ISSUES;
