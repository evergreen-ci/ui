import styled from "@emotion/styled";
import { StoryObj } from "@storybook/react";
import {
  getSpruceConfigMock,
  getUserSettingsMock,
} from "gql/mocks/getSpruceConfig";
import { VersionLabel } from ".";

export default {
  title: "Pages/Waterfall/VersionLabel",
  component: VersionLabel,
};

const version = {
  activated: true,
  author: "Sophie Stadler",
  createTime: new Date("2024-09-19T14:56:08Z"),
  gitTags: null,
  id: "evergreen_ui_aec8832bace91f0f3b6d8ad3bb3b27fb4263be83",
  message:
    "DEVPROD-11387: Remove CSS grid layout, plus some additional description to demonstrate the overflow capabilities of the component (#397)",
  revision: "aec8832bace91f0f3b6d8ad3bb3b27fb4263be83",
  upstreamProject: null,
};

const versionWithGitTag = {
  activated: true,
  author: "Sophie Stadler",
  createTime: new Date("2024-09-19T16:14:10Z"),
  gitTags: [
    {
      tag: "parsley/v2.1.64",
    },
  ],
  id: "evergreen_ui_deb77a36604446272d610d267f1cd9f95e4fe8ff",
  message: "parsley/v2.1.64",
  revision: "deb77a36604446272d610d267f1cd9f95e4fe8ff",
  upstreamProject: null,
};

const versionWithUpstreamProject = {
  activated: true,
  author: "Sophie Stadler",
  createTime: new Date("2024-09-19T16:06:54Z"),
  gitTags: [
    {
      tag: "spruce/v4.1.87",
    },
  ],
  id: "evergreen_ui_130948895a46d4fd04292e7783069918e4e7cd5a",
  message: "spruce/v4.1.87",
  revision: "130948895a46d4fd04292e7783069918e4e7cd5a",
  upstreamProject: {
    owner: "evergreen-ci",
    project: "evergreen",
    repo: "evergreen",
    revision: "abcdefg",
    task: {
      execution: 0,
      id: "678",
    },
    triggerID: "12345",
    triggerType: "task",
    version: {
      id: "9876",
    },
  },
};

const versionInactiveUntrimmedMessage = {
  activated: false,
  author: "Sophie Stadler",
  createTime: new Date("2024-09-19T14:56:08Z"),
  gitTags: null,
  id: "evergreen_ui_aec8832bace91f0f3b6d8ad3bb3b27fb4263be83",
  message:
    "DEVPROD-11387: Remove CSS grid layout, plus some additional description to demonstrate the overflow capabilities of the component (#397)",
  revision: "aec8832bace91f0f3b6d8ad3bb3b27fb4263be83",
  upstreamProject: null,
  trimMessage: false,
};

const versionBroken = {
  activated: true,
  author: "Sophie Stadler",
  createTime: new Date("2024-09-19T14:56:08Z"),
  gitTags: null,
  id: "evergreen_ui_aec8832bace91f0f3b6d8ad3bb3b27fb4263be83",
  message:
    "DEVPROD-11387: Remove CSS grid layout, plus some additional description to demonstrate the overflow capabilities of the component (#397)",
  revision: "aec8832bace91f0f3b6d8ad3bb3b27fb4263be83",
  upstreamProject: null,
  errors: ["errors happened"],
};
export const Default: StoryObj<typeof VersionLabel> = {
  render: (args) => (
    <Container>
      <VersionLabel {...args} />
    </Container>
  ),
  parameters: {
    apolloClient: {
      mocks: [getSpruceConfigMock, getUserSettingsMock],
    },
  },
  args: version,
};

export const GitTag: StoryObj<typeof VersionLabel> = {
  ...Default,
  args: versionWithGitTag,
};

export const UpstreamProject: StoryObj<typeof VersionLabel> = {
  ...Default,
  args: versionWithUpstreamProject,
};

export const InactiveUntrimmedMessage: StoryObj<typeof VersionLabel> = {
  ...Default,
  args: versionInactiveUntrimmedMessage,
};

export const SmallSize: StoryObj<typeof VersionLabel> = {
  ...Default,
  args: { ...version, size: "small" },
};

export const Broken: StoryObj<typeof VersionLabel> = {
  ...Default,
  args: versionBroken,
};

const Container = styled.div`
  max-width: 300px;
`;
