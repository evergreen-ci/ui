import styled from "@emotion/styled";
import { StoryObj } from "@storybook/react";
import { InactiveVersion } from "../styles";
import {
  inactiveVersion,
  inactiveBrokenVersion,
  version,
  versionWithGitTag,
  versionWithUpstreamProject,
  versionBroken,
} from "../testData";
import { InactiveVersionsButton } from ".";

export default {
  title: "Pages/Waterfall/InactiveVersions",
  component: InactiveVersionsButton,
};

const render: StoryObj<typeof InactiveVersionsButton>["render"] = (args) => (
  <Container>
    <InactiveVersion>
      <InactiveVersionsButton {...args} />
    </InactiveVersion>
  </Container>
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

const Container = styled.div`
  display: flex;
`;
