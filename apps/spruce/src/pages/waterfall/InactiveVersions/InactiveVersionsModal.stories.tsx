import styled from "@emotion/styled";
import { StoryObj } from "@storybook/react-vite";
import { InactiveVersion } from "../styles";
import {
  inactiveBrokenVersion,
  inactiveVersion,
  version,
  versionBroken,
  versionWithGitTag,
  versionWithUpstreamProject,
} from "../testData";
import { InactiveVersionsButton } from ".";

export default {
  component: InactiveVersionsButton,
  title: "Pages/Waterfall/InactiveVersions",
};

const render: StoryObj<typeof InactiveVersionsButton>["render"] = (args) => (
  <Container>
    <InactiveVersion>
      <InactiveVersionsButton {...args} />
    </InactiveVersion>
  </Container>
);

export const Default: StoryObj<typeof InactiveVersionsButton> = {
  args: {
    versions: [inactiveVersion],
  },
  render,
};

export const Broken: StoryObj<typeof InactiveVersionsButton> = {
  args: {
    versions: [inactiveVersion, inactiveBrokenVersion],
  },
  render,
};

export const FilteredAndInactive: StoryObj<typeof InactiveVersionsButton> = {
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
  render,
};

export const Filtered: StoryObj<typeof InactiveVersionsButton> = {
  args: {
    versions: [
      version,
      versionWithGitTag,
      versionWithUpstreamProject,
      versionBroken,
    ],
  },
  render,
};

const Container = styled.div`
  display: flex;
`;
