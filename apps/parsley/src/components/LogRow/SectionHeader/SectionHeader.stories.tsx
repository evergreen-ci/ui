import styled from "@emotion/styled";
import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { RowType } from "types/logs";
import SectionHeader from ".";

export default {
  component: SectionHeader,
} satisfies CustomMeta<typeof SectionHeader>;

const SectionHeaderStory = () => (
  <Container>
    <SectionHeader
      {...sectionHeaderProps}
      lineIndex={0}
      sectionHeaderLine={{
        ...baseSectionHeaderLine,
        functionName: "populate_expansions",
      }}
    />
    <SectionHeader
      {...sectionHeaderProps}
      lineIndex={1}
      sectionHeaderLine={{
        ...baseSectionHeaderLine,
        functionName: "setup_mongodb_database_and_seed_with_data",
        range: { end: 8, start: 6 },
      }}
    />
    <SectionHeader
      {...sectionHeaderProps}
      lineIndex={2}
      sectionHeaderLine={{
        ...baseSectionHeaderLine,
        functionName: "build_frontend",
        range: { end: 12, start: 11 },
      }}
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

const baseSectionHeaderLine = {
  functionID: "function-4",
  functionName: "load_data",
  isOpen: true,
  range: { end: 5, start: 2 },
  rowType: RowType.SectionHeader as const,
};

const sectionHeaderProps = {
  failingLine: 11,
  lineIndex: 0,
  sectionHeaderLine: baseSectionHeaderLine,
};
