import React from "react";
import {
  MockedProvider as ApolloMockedProvider,
  MockedProviderProps,
} from "@apollo/client/testing";
import { cache } from "gql/client/cache";
import {
  getSpruceConfigMock,
  getUserSettingsMock,
  baseVersionAndTaskMock,
  taskTestSampleMock,
  buildBaronMock,
  taskOwnerTeamsMock,
  versionMock,
  versionMock1234,
  taskStatusesMock,
  taskStatusesMock1234,
  taskStatusesUndefinedMock,
  taskStatusesEmptyStringMock,
} from "gql/mocks/getSpruceConfig";

import {
  JIRA_ISSUES,
  JIRA_SUSPECTED_ISSUES,
  JIRA_CUSTOM_CREATED_ISSUES,
  CREATED_TICKETS,
  BUILD_VARIANTS_FOR_TASK_NAME,
  TASK_NAMES_FOR_BUILD_VARIANT,
  BUILD_BARON,
} from "gql/queries";

const createGenericMock = (query: unknown, variables = {}) => ({
  request: { query, variables },
  result: { data: {} },
});

const issuesMock = createGenericMock(JIRA_ISSUES, {
  taskId: "task_id",
  execution: 0,
});
const suspectedIssuesMock = createGenericMock(JIRA_SUSPECTED_ISSUES, {
  taskId: "task_id",
  execution: 0,
});
const customCreatedIssuesMock = createGenericMock(JIRA_CUSTOM_CREATED_ISSUES, {
  taskId: "task_id",
  execution: 0,
});
const createdTicketsMock = createGenericMock(CREATED_TICKETS, {
  taskId: "task_id",
});
const buildVariantsForTaskNameMock = createGenericMock(
  BUILD_VARIANTS_FOR_TASK_NAME,
  { projectIdentifier: "project", taskName: "task" },
);
const taskNamesForBuildVariantMock = createGenericMock(
  TASK_NAMES_FOR_BUILD_VARIANT,
  { projectIdentifier: "project", buildVariant: "variant" },
);

const specialTaskId =
  "spruce_ubuntu1604_e2e_test_e0ece5ad52ad01630bdf29f55b9382a26d6256b3_20_08_26_19_20_41";
const specialExecution = 0;

const specialBuildBaronMock = {
  request: {
    query: BUILD_BARON,
    variables: {
      taskId: specialTaskId,
      execution: specialExecution,
    },
  },
  result: {
    data: {
      buildBaron: {
        __typename: "BuildBaron",
        bbTicketCreationDefined: true,
        buildBaronConfigured: true,
        searchReturnInfo: {
          __typename: "SearchReturnInfo",
          featuresURL: "",
          issues: [
            {
              __typename: "JiraTicket",
              key: "EVG-12345",
              fields: {
                __typename: "TicketFields",
                summary: "This is a random Jira ticket title 1",
                assigneeDisplayName: null,
                resolutionName: "Declined",
                created: "2020-09-23T15:31:33.000+0000",
                updated: "2020-09-23T15:33:02.000+0000",
                status: {
                  __typename: "JiraStatus",
                  id: "5",
                  name: "Resolved",
                },
              },
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

const specialCreatedTicketsMock = {
  request: {
    query: CREATED_TICKETS,
    variables: {
      taskId: specialTaskId,
    },
  },
  result: {
    data: {
      bbGetCreatedTickets: [],
    },
  },
};

const specialCustomCreatedIssuesMock = {
  request: {
    query: JIRA_CUSTOM_CREATED_ISSUES,
    variables: {
      taskId: specialTaskId,
      execution: specialExecution,
    },
  },
  result: {
    data: {
      task: {
        id: specialTaskId,
        execution: specialExecution,
        annotation: null,
      },
    },
  },
};

const defaultMocks = [
  getSpruceConfigMock,
  getUserSettingsMock,
  baseVersionAndTaskMock,
  taskTestSampleMock,
  buildBaronMock,
  taskOwnerTeamsMock,
  versionMock,
  versionMock1234,
  taskStatusesMock,
  taskStatusesMock1234,
  taskStatusesUndefinedMock,
  taskStatusesEmptyStringMock,

  issuesMock,
  suspectedIssuesMock,
  customCreatedIssuesMock,
  createdTicketsMock,
  buildVariantsForTaskNameMock,
  taskNamesForBuildVariantMock,
  specialBuildBaronMock,
  specialCreatedTicketsMock,
  specialCustomCreatedIssuesMock,
];

const CustomMockedProvider: React.FC<MockedProviderProps> = ({
  children,
  mocks = [],
  ...props
}) => {
  const combinedMocks = [...(mocks || []), ...defaultMocks];

  return (
    <ApolloMockedProvider
      cache={cache}
      mocks={combinedMocks as MockedProviderProps["mocks"]}
      {...props}
    >
      {children}
    </ApolloMockedProvider>
  );
};

export { CustomMockedProvider as MockedProvider };
