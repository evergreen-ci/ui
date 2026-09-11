import { StoryObj } from "@storybook/react-vite";
import sharedStyles from "../styles.module.css";
import {
  inactiveBrokenVersion,
  inactiveVersion,
  version,
  versionBroken,
  versionWithGitTag,
  versionWithUpstreamProject,
} from "../testData";
import styles from "./InactiveVersionsModal.stories.module.css";
import { InactiveVersionsButton } from ".";

export default {
  title: "Pages/Waterfall/InactiveVersions",
  component: InactiveVersionsButton,
};

const render: StoryObj<typeof InactiveVersionsButton>["render"] = (args) => (
  <div className={styles.container}>
    <div className={sharedStyles.inactiveVersion}>
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
