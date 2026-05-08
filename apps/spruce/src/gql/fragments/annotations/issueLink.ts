import { gql } from "@apollo/client";
import { JIRA_TICKET } from "./jiraTicket";

export const ISSUE_LINK = gql`
  fragment IssueLink on IssueLink {
    confidenceScore
    issueKey
    jiraTicket {
      ...JiraTicket
    }
    source {
      author
      requester
      time
    }
    url
  }
  ${JIRA_TICKET}
`;
