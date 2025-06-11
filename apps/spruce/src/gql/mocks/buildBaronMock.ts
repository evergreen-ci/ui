import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import {
  BuildBaronQuery,
  BuildBaronQueryVariables,
  CreatedTicketsQuery,
  CreatedTicketsQueryVariables,
  CustomCreatedIssuesQuery,
  CustomCreatedIssuesQueryVariables,
  SuspectedIssuesQuery,
  SuspectedIssuesQueryVariables,
} from "gql/generated/types";
import {
  BUILD_BARON,
  CREATED_TICKETS,
  JIRA_CUSTOM_CREATED_ISSUES,
  JIRA_ISSUES,
  JIRA_SUSPECTED_ISSUES,
} from "gql/queries";

const taskId =
  "spruce_ubuntu1604_e2e_test_e0ece5ad52ad01630bdf29f55b9382a26d6256b3_20_08_26_19_20_41";
const execution = 0;

export const customBuildBaronMock: ApolloMock<
  BuildBaronQuery,
  BuildBaronQueryVariables
> = {
  request: {
    query: BUILD_BARON,
    variables: {
      taskId,
      execution,
    },
  },
  result: {
    data: {
      __typename: "Query",
      buildBaron: {
        __typename: "BuildBaron",
        bbTicketCreationDefined: true,
        buildBaronConfigured: true,
        searchReturnInfo: {
          __typename: "SearchReturnInfo",
          featuresURL: "https://example.com/features",
          issues: [
            {
              __typename: "JiraTicket",
              fields: {
                __typename: "TicketFields",
                assigneeDisplayName: null,
                created: "2020-09-23T15:31:33.000+0000",
                resolutionName: "Declined",
                status: {
                  __typename: "JiraStatus",
                  id: "5",
                  name: "Resolved",
                },
                summary: "This is a random Jira ticket title 1",
                updated: "2020-09-23T15:33:02.000+0000",
              },
              key: "EVG-12345",
            },
            {
              __typename: "JiraTicket",
              fields: {
                __typename: "TicketFields",
                assigneeDisplayName: "Some Name",
                created: "2020-09-18T16:58:32.000+0000",
                resolutionName: "Declined",
                status: {
                  __typename: "JiraStatus",
                  id: "6",
                  name: "Closed",
                },
                summary: "This is a random Jira ticket title 2",
                updated: "2020-09-18T19:56:42.000+0000",
              },
              key: "EVG-12346",
            },
            {
              __typename: "JiraTicket",
              fields: {
                __typename: "TicketFields",
                assigneeDisplayName: "Backlog - Evergreen Team",
                created: "2020-09-18T17:04:06.000+0000",
                resolutionName: "Declined",
                status: {
                  __typename: "JiraStatus",
                  id: "1",
                  name: "Open",
                },
                summary: "This is a random Jira ticket title 3",
                updated: "2020-09-18T19:56:29.000+0000",
              },
              key: "EVG-12347",
            },
          ],
          search:
            '(project in (EVG)) and ( text~"docker\\\\-cleanup" ) order by updatedDate desc',
          source: "JIRA",
        },
      },
    },
  },
};

export const customJiraTicketsMock: ApolloMock<
  CreatedTicketsQuery,
  CreatedTicketsQueryVariables
> = {
  request: {
    query: CREATED_TICKETS,
    variables: {
      taskId,
    },
  },
  result: {
    data: {
      bbGetCreatedTickets: [],
    },
  },
};

export const customCreatedIssuesMock: ApolloMock<
  CustomCreatedIssuesQuery,
  CustomCreatedIssuesQueryVariables
> = {
  request: {
    query: JIRA_CUSTOM_CREATED_ISSUES,
    variables: {
      taskId,
      execution,
    },
  },
  result: {
    data: {
      task: {
        id: taskId,
        execution,
        annotation: null,
      },
    },
  },
};

export const customSuspectedIssueMock: ApolloMock<
  SuspectedIssuesQuery,
  SuspectedIssuesQueryVariables
> = {
  request: {
    query: JIRA_SUSPECTED_ISSUES,
    variables: {
      taskId,
      execution,
    },
  },
  result: {
    data: {
      task: {
        id: taskId,
        execution,
        annotation: null,
      },
    },
  },
};

export const customJiraIssuesMock: ApolloMock<
  SuspectedIssuesQuery,
  SuspectedIssuesQueryVariables
> = {
  request: {
    query: JIRA_ISSUES,
    variables: {
      taskId,
      execution,
    },
  },
  result: {
    data: {
      task: {
        id: taskId,
        execution,
        annotation: null,
      },
    },
  },
};
