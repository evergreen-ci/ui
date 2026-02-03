import styled from "@emotion/styled";
import { CustomStoryObj, CustomMeta } from "@evg-ui/lib/test_utils";
import { siderCardWidth } from "components/styles/Layout";
import TagsMetadata from ".";

export default {
  component: TagsMetadata,
} satisfies CustomMeta<typeof TagsMetadata>;

export const Default: CustomStoryObj<typeof TagsMetadata> = {
  render: (args) => (
    <Container>
      <TagsMetadata {...args} />
    </Container>
  ),
  args: {
    tags: ["tag1", "tag2", "tag3"],
    failureMetadataTags: ["failureTag1", "failureTag2"],
  },
};

export const NoTags: CustomStoryObj<typeof TagsMetadata> = {
  render: (args) => (
    <Container>
      <TagsMetadata {...args} />
    </Container>
  ),
  args: {
    tags: [],
    failureMetadataTags: [],
  },
};

export const OnlyFailureMetadataTags: CustomStoryObj<typeof TagsMetadata> = {
  render: (args) => (
    <Container>
      <TagsMetadata {...args} />
    </Container>
  ),
  args: {
    tags: [],
    failureMetadataTags: ["failureTag1", "failureTag2"],
  },
};

export const OnlyTags: CustomStoryObj<typeof TagsMetadata> = {
  render: (args) => (
    <Container>
      <TagsMetadata {...args} />
    </Container>
  ),
  args: {
    tags: ["tag1", "tag2", "tag3"],
    failureMetadataTags: [],
  },
};

const Container = styled.div`
  width: ${siderCardWidth}px;
`;
