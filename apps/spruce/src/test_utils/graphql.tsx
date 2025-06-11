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
