import styled from "@emotion/styled";
import {
  ApolloMock,
  CustomMeta,
  CustomStoryObj,
} from "@evg-ui/lib/test_utils/types";
import { Requester } from "constants/requesters";
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

export const WithTriggeredBy: CustomStoryObj<typeof Metadata> = {
  render: (args) => (
    <Container>
      <Metadata
        {...args}
        version={{
          ...version,
          upstreamProject: {
            __typename: "UpstreamProject",
            owner: "mongodb",
            project: "mongo",
            repo: "mongo",
            revision: "def5361abc",
            triggerID: "mongo_def5361abc",
            triggerType: "push",
            task: null,
            version: null,
          },
        }}
      />
    </Container>
  ),
};

export const WithModulesAndGitTags: CustomStoryObj<typeof Metadata> = {
  render: (args) => (
    <Container>
      <Metadata
        {...args}
        version={{
          ...version,
          gitTags: [
            { __typename: "GitTag", pusher: "testuser", tag: "v1.2.3" },
            { __typename: "GitTag", pusher: "testuser", tag: "stable" },
          ],
          manifest: {
            __typename: "Manifest",
            id: "manifest123",
            branch: "main",
            isBase: false,
            moduleOverrides: null,
            modules: {
              wiredtiger: {
                branch: "main",
                repo: "wiredtiger",
                revision: "wiredtiger_revision",
              },
            },
            project: "evergreen",
            revision: version.revision,
          },
          patch: {
            __typename: "Patch",
            id: "patch123",
            alias: null,
            githubPatchData: null,
            includedLocalModules: [
              {
                __typename: "IncludedLocalModule",
                fileName: "wiredtiger.patch",
                module: "wiredtiger",
              },
              {
                __typename: "IncludedLocalModule",
                fileName: "enterprise.patch",
                module: "enterprise",
              },
            ],
            patchNumber: 1,
          },
        }}
      />
    </Container>
  ),
};

export const GithubPullRequest: CustomStoryObj<typeof Metadata> = {
  render: (args) => (
    <Container>
      <Metadata
        {...args}
        version={{
          ...version,
          baseVersion: { __typename: "Version", id: "base123" },
          isPatch: true,
          patch: {
            __typename: "Patch",
            id: "patch123",
            alias: null,
            githubPatchData: {
              __typename: "GithubPatch",
              headHash: "9f8e7d6c5b4a39281706f5e4d3c2b1a098765432",
              prNumber: 1234,
            },
            includedLocalModules: [],
            patchNumber: 1,
          },
          requester: Requester.GitHubPR,
        }}
      />
    </Container>
  ),
};

export const GithubMergeQueue: CustomStoryObj<typeof Metadata> = {
  render: (args) => (
    <Container>
      <Metadata
        {...args}
        version={{
          ...version,
          baseVersion: { __typename: "Version", id: "base123" },
          isPatch: true,
          requester: Requester.GitHubMergeQueue,
        }}
      />
    </Container>
  ),
};

const Container = styled.div`
  width: 275px;
`;
