import styled from "@emotion/styled";
import { StoryObj } from "@storybook/react-vite";
import {
  getSpruceConfigMock,
  getUserSettingsMock,
} from "gql/mocks/getSpruceConfig";
import {
  getTaskStatsMock,
  version,
  versionBroken,
  versionWithGitTag,
  versionWithUpstreamProject,
} from "../testData";
import { getVersionUpstreamProjectMock } from "./testData";
import { VersionLabel, VersionLabelView } from ".";

export default {
  args: {
    view: VersionLabelView.Modal,
  },
  argTypes: {
    view: {
      control: { type: "select" },
      options: Object.values(VersionLabelView),
    },
  },
  component: VersionLabel,
  title: "Pages/Waterfall/VersionLabel",
};

export const Default: StoryObj<typeof VersionLabel> = {
  args: version,
  parameters: {
    apolloClient: {
      mocks: [getSpruceConfigMock, getUserSettingsMock],
    },
  },
  render: (args) => (
    <Container>
      <VersionLabel {...args} />
    </Container>
  ),
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
