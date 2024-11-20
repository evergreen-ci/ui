import styled from "@emotion/styled";
import { StoryObj } from "@storybook/react";
import {
  getSpruceConfigMock,
  getUserSettingsMock,
} from "gql/mocks/getSpruceConfig";
import { VersionLabel, VersionLabelView } from ".";
import {
  version,
  versionWithGitTag,
  versionWithUpstreamProject,
  versionBroken,
} from "../testData";

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
};

export const SmallSize: StoryObj<typeof VersionLabel> = {
  ...Default,
  args: { ...version, view: VersionLabelView.Waterfall },
};

export const Broken: StoryObj<typeof VersionLabel> = {
  ...Default,
  args: versionBroken,
};

export const TaskStatsTooltip: StoryObj<typeof VersionLabel> = {
  ...Default,
  args: {
    ...version,
    taskStatusStats: {
      counts: [
        {
          status: "blocked",
          count: 4,
        },
        {
          status: "failed",
          count: 3,
        },
        {
          status: "setup-failed",
          count: 3,
        },
        {
          status: "started",
          count: 22,
        },
        {
          status: "success",
          count: 255,
        },
        {
          status: "unscheduled",
          count: 2313,
        },
        {
          status: "will-run",
          count: 100,
        },
      ],
    },
    view: VersionLabelView.Waterfall,
  },
};

const Container = styled.div`
  max-width: 300px;
`;
