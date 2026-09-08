import styled from "@emotion/styled";
import {
  ApolloMock,
  CustomMeta,
  CustomStoryObj,
} from "@evg-ui/lib/test_utils/types";
import {
  VersionQuarantinedTasksQuery,
  VersionQuarantinedTasksQueryVariables,
  VersionQuery,
  VersionQueryVariables,
} from "gql/generated/types";
import { VERSION, VERSION_QUARANTINED_TASKS } from "gql/queries";
import { PatchStatus } from "types/patch";
import { Metadata } from ".";

type Version = NonNullable<VersionQuery["version"]>;

export default {
  component: Metadata,
} satisfies CustomMeta<typeof Metadata>;

const version: Version = {
  __typename: "Version",
  activated: true,
  baseVersion: null,
  cost: null,
  createTime: new Date("2024-01-01T15:00:00Z"),
  errors: [],
  externalLinksForMetadata: [
    {
      __typename: "ExternalLinkForMetadata",
      displayName: "Project Dashboard",
      url: "https://example.com/project",
    },
  ],
  finishTime: new Date("2024-01-01T15:45:00Z"),
  gitTags: null,
  id: "version123",
  ignored: false,
  isPatch: false,
  manifest: null,
  message: "Test commit",
  order: 1,
  parameters: [],
  patch: null,
  previousVersion: {
    __typename: "Version",
    id: "prev123",
    revision: "prevrevision",
  },
  projectMetadata: {
    __typename: "Project",
    branch: "main",
    id: "evergreen",
    identifier: "evergreen",
    owner: "evergreen-ci",
    repo: "evergreen",
    testSelection: null,
  },
  quarantinedTestsSkippedCount: 0,
  repo: "evergreen",
  requester: "gitter_request",
  revision: "abc123def456",
  startTime: new Date("2024-01-01T15:05:00Z"),
  status: PatchStatus.Success,
  taskCount: null,
  upstreamProject: null,
  user: {
    __typename: "User",
    displayName: "Test User",
    userId: "testuser",
  },
  versionTiming: {
    __typename: "VersionTiming",
    makespan: 2700000,
    timeTaken: 1800000,
  },
  warnings: [],
};

const versionMock: ApolloMock<VersionQuery, VersionQueryVariables> = {
  request: {
    query: VERSION,
    variables: { id: version.id, includeNeverActivatedTasks: false },
  },
  result: {
    data: { version },
  },
};

const versionWithSkippedTests: Version = {
  ...version,
  quarantinedTestsSkippedCount: 12,
  projectMetadata: {
    ...version.projectMetadata!,
    testSelection: {
      __typename: "TestSelectionSettings",
      allowed: true,
    },
  },
};

const versionSkippedTestsMock: ApolloMock<
  VersionQuarantinedTasksQuery,
  VersionQuarantinedTasksQueryVariables
> = {
  request: {
    query: VERSION_QUARANTINED_TASKS,
    variables: { versionId: version.id },
  },
  result: {
    data: {
      version: {
        __typename: "Version",
        id: version.id,
        tasks: {
          __typename: "VersionTasks",
          count: 1,
          data: [
            {
              __typename: "Task",
              id: "task123",
              buildVariantDisplayName: "Ubuntu 22.04",
              displayName: "test_task",
              execution: 0,
              quarantinedTestsSkippedCount: 12,
            },
          ],
        },
      },
    },
  },
};

export const WithTimeline: CustomStoryObj<typeof Metadata> = {
  render: (args) => (
    <Container>
      <Metadata {...args} version={version} />
    </Container>
  ),
};

export const WithSkippedTests: CustomStoryObj<typeof Metadata> = {
  render: (args) => (
    <Container>
      <Metadata {...args} version={versionWithSkippedTests} />
    </Container>
  ),
  parameters: {
    apolloClient: {
      mocks: [versionMock, versionSkippedTestsMock],
    },
  },
};

export const WithExecutionData: CustomStoryObj<typeof Metadata> = {
  render: (args) => (
    <Container>
      <Metadata
        {...args}
        version={{
          ...version,
          cost: { __typename: "Cost", total: 12.34 },
          parameters: [
            {
              __typename: "Parameter",
              key: "run_tests",
              value: "true",
            },
          ],
        }}
      />
    </Container>
  ),
};

const Container = styled.div`
  width: 275px;
`;
