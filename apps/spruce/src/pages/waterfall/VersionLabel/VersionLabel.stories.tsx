import { StoryObj } from "@storybook/react-vite";
import { userEvent, within } from "storybook/test";
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
import styles from "./VersionLabel.stories.module.css";
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
    <div className={styles.container}>
      <VersionLabel {...args} />
    </div>
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

export const TaskStatsOpen: StoryObj<typeof VersionLabel> = {
  ...SmallSize,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "Show task stats" }),
    );
    await within(canvasElement.ownerDocument.body).findByText("Total tasks");
  },
};

export const Broken: StoryObj<typeof VersionLabel> = {
  ...Default,
  args: versionBroken,
};
