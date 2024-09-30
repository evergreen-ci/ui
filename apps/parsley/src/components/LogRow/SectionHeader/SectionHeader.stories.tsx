import styled from "@emotion/styled";
import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { SectionStatus } from "constants/logs";
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

export const SectionHeaderMany: CustomStoryObj<typeof SectionHeader> = {
  render: () => <SectionHeaderStory />,
};

// TODO: Update this story with LogPane examples which should handle log rendering internally.

const Container = styled.div`
  height: 400px;
  width: 800px;
`;

const sectionHeaderProps = {
  functionID: "function-4",
  onToggle: () => {},
  open: true,
  status: SectionStatus.Pass,
};
