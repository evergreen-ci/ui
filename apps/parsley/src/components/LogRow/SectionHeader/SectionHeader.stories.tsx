import styled from "@emotion/styled";
import { SectionStatus } from "constants/logs";
import { CustomMeta, CustomStoryObj } from "test_utils/types";
import SectionHeader from ".";

export default {
  component: SectionHeader,
} satisfies CustomMeta<typeof SectionHeader>;

const SectionHeaderStory = () => (
  <Container>
    <SectionHeader
      {...sectionHeaderProps}
      functionName="populate_expansions"
      lineIndex={0}
    />
    <SectionHeader
      {...sectionHeaderProps}
      functionName="setup_mongodb_database_and_seed_with_data"
      lineIndex={1}
    />
    <SectionHeader
      {...sectionHeaderProps}
      functionName="build_frontend"
      lineIndex={2}
      status={SectionStatus.Fail}
    />
  </Container>
);

export const SectionHeaderSingle: CustomStoryObj<typeof SectionHeader> = {
  render: () => <SectionHeaderStory />,
};

// TODO: Update this story with LogPane examples which should handle log rendering internally.

const Container = styled.div`
  height: 400px;
  width: 800px;
`;

const sectionHeaderProps = {
  defaultOpen: false,
  onFocus: () => {},
  onOpen: () => {},
  open: true,
  status: SectionStatus.Pass,
};
