import styled from "@emotion/styled";
import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { VersionQuery } from "gql/generated/types";
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
  },
  repo: "evergreen",
  requester: "gitter_request",
  revision: "abc123def456",
  startTime: new Date("2024-01-01T15:05:00Z"),
  status: PatchStatus.Success,
  taskCount: null,
  upstreamProject: null,
  user: {
    __typename: "UserLite",
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

export const WithTimeline: CustomStoryObj<typeof Metadata> = {
  render: (args) => (
    <Container>
      <Metadata {...args} version={version} />
    </Container>
  ),
};

const Container = styled.div`
  width: 275px;
`;
