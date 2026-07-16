import styled from "@emotion/styled";
import { CustomStoryObj, CustomMeta } from "@evg-ui/lib/test_utils/types";
import { siderCardWidth } from "components/styles/Layout";
import TagsMetadata from ".";

export default {
  component: TagsMetadata,
} satisfies CustomMeta<typeof TagsMetadata>;

export const Default: CustomStoryObj<typeof TagsMetadata> = {
  args: {
    failureMetadataTags: ["failureTag1", "failureTag2"],
    tags: ["tag1", "tag2", "tag3"],
  },
  render: (args) => (
    <Container>
      <TagsMetadata {...args} />
    </Container>
  ),
};

export const NoTags: CustomStoryObj<typeof TagsMetadata> = {
  args: {
    failureMetadataTags: [],
    tags: [],
  },
  render: (args) => (
    <Container>
      <TagsMetadata {...args} />
    </Container>
  ),
};

export const OnlyFailureMetadataTags: CustomStoryObj<typeof TagsMetadata> = {
  args: {
    failureMetadataTags: ["failureTag1", "failureTag2"],
    tags: [],
  },
  render: (args) => (
    <Container>
      <TagsMetadata {...args} />
    </Container>
  ),
};

export const OnlyTags: CustomStoryObj<typeof TagsMetadata> = {
  args: {
    failureMetadataTags: [],
    tags: ["tag1", "tag2", "tag3"],
  },
  render: (args) => (
    <Container>
      <TagsMetadata {...args} />
    </Container>
  ),
};

const Container = styled.div`
  width: ${siderCardWidth}px;
`;
