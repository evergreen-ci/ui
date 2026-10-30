import { StoryObj } from "@storybook/react-vite";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import { Requester } from "constants/requesters";
import {
  VersionUpstreamProjectQuery,
  VersionUpstreamProjectQueryVariables,
} from "gql/generated/types";
import {
  getSpruceConfigMock,
  getUserSettingsMock,
} from "gql/mocks/getSpruceConfig";
import { VERSION_UPSTREAM_PROJECT } from "gql/queries";
import {
  inactiveBrokenVersion,
  inactiveVersion,
  version,
  versionBroken,
  versionWithGitTag,
  versionWithUpstreamProject,
} from "../testData";
import { Version } from "../types";
import styles from "./InactiveVersionsModal.stories.module.css";
import { InactiveVersionsButton } from ".";

const getModuleVersion = (
  suffix: string,
  baseRevision: string,
  overrides: Partial<Version> = {},
): Version => ({
  ...inactiveVersion,
  id: `module_${suffix}`,
  message: `Module commit ${suffix}`,
  project: { id: "mongo", owner: "10gen", repo: "mongo" },
  requester: Requester.Trigger,
  revision: baseRevision,
  ...overrides,
});

const upstreamProjectMock = (
  versionId: string,
): ApolloMock<
  VersionUpstreamProjectQuery,
  VersionUpstreamProjectQueryVariables
> => ({
  request: {
    query: VERSION_UPSTREAM_PROJECT,
    variables: { versionId },
  },
  result: {
    data: {
      version: {
        __typename: "Version",
        id: versionId,
        upstreamProject: {
          owner: "10gen",
          project: "dsi",
          repo: "dsi",
          revision: "abcdefg",
          task: { execution: 0, id: "dsi_task" },
          triggerID: "12345",
          triggerType: "task",
          version: { id: "dsi_version" },
        },
      },
    },
  },
});

const moduleGroupingVersions: Version[] = [
  getModuleVersion("a1", inactiveVersion.revision, {
    createTime: new Date("2024-10-28T16:30:00Z"),
  }),
  getModuleVersion("a2", inactiveVersion.revision, {
    createTime: new Date("2024-10-28T15:30:00Z"),
    errors: ["Error string"],
  }),
  getModuleVersion("a3", inactiveVersion.revision, {
    createTime: new Date("2024-10-28T14:30:00Z"),
  }),
  inactiveVersion,
  getModuleVersion("b1", "def15635174517451980", {
    createTime: new Date("2024-10-26T18:00:00Z"),
  }),
];

export default {
  title: "Pages/Waterfall/InactiveVersions",
  component: InactiveVersionsButton,
};

const render: StoryObj<typeof InactiveVersionsButton>["render"] = (args) => (
  <div className={styles.container}>
    <div className={styles.inactiveVersion}>
      <InactiveVersionsButton {...args} />
    </div>
  </div>
);

export const Default: StoryObj<typeof InactiveVersionsButton> = {
  render,
  args: {
    versions: [inactiveVersion],
  },
};

export const Broken: StoryObj<typeof InactiveVersionsButton> = {
  render,
  args: {
    versions: [inactiveVersion, inactiveBrokenVersion],
  },
};

export const FilteredAndInactive: StoryObj<typeof InactiveVersionsButton> = {
  render,
  args: {
    versions: [
      version,
      versionWithGitTag,
      inactiveVersion,
      versionWithUpstreamProject,
      versionBroken,
      inactiveBrokenVersion,
    ],
  },
};

export const Filtered: StoryObj<typeof InactiveVersionsButton> = {
  render,
  args: {
    versions: [
      version,
      versionWithGitTag,
      versionWithUpstreamProject,
      versionBroken,
    ],
  },
};

export const ModuleGrouping: StoryObj<typeof InactiveVersionsButton> = {
  render,
  args: {
    versions: moduleGroupingVersions,
  },
  parameters: {
    apolloClient: {
      mocks: [
        getSpruceConfigMock,
        getUserSettingsMock,
        ...moduleGroupingVersions
          .filter(({ requester }) => requester === Requester.Trigger)
          .map(({ id }) => upstreamProjectMock(id)),
      ],
    },
  },
};
