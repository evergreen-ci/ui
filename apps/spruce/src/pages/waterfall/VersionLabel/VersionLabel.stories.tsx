import styled from "@emotion/styled";
import { StoryObj } from "@storybook/react";
import {
  getSpruceConfigMock,
  getUserSettingsMock,
} from "gql/mocks/getSpruceConfig";
import {
  getTaskStatsMock,
  version,
  versionWithGitTag,
  versionWithUpstreamProject,
  versionBroken,
} from "../testData";
import { getVersionUpstreamProjectMock } from "./testData";
import { VersionLabel, VersionLabelView } from ".";

export default {
  title: "Pages/Waterfall/VersionLabel",
  component: VersionLabel,
  args: {
    view: VersionLabelView.Modal,
  },
  argTypes: {
    view: {
      options: Object.values(VersionLabelView),
      control: { type: "select" },
    },
  },
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
  parameters: {
    apolloClient: {
      mocks: [
        getSpruceConfigMock,
        getUserSettingsMock,
        getVersionUpstreamProjectMock,
      ],
    },
  },
};

export const SmallSize: StoryObj<typeof VersionLabel> = {
  ...Default,
  args: { ...version, view: VersionLabelView.Waterfall },
  parameters: {
    apolloClient: {
      mocks: [
        getTaskStatsMock(version.id),
        getSpruceConfigMock,
        getUserSettingsMock,
      ],
    },
  },
};

export const Broken: StoryObj<typeof VersionLabel> = {
  ...Default,
  args: versionBroken,
};

const Container = styled.div`
  max-width: 300px;
`;
