import styled from "@emotion/styled";
import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils";
import { RowType } from "types/logs";
import SubsectionHeader from ".";

export default {
  component: SubsectionHeader,
} satisfies CustomMeta<typeof SubsectionHeader>;

const SubsectionHeaderStory = () => (
  <Container>
    <SubsectionHeader
      {...subsectionHeaderProps}
      failingLine={undefined}
      lineIndex={0}
      subsectionHeaderLine={{
        ...baseSubsectionHeaderLine,
        isOpen: true,
      }}
    />
    <SubsectionHeader
      {...subsectionHeaderProps}
      failingLine={5}
      lineIndex={0}
      subsectionHeaderLine={{
        ...baseSubsectionHeaderLine,
        commandDescription: "Updating task expansions",
      }}
    />
    <SubsectionHeader
      {...subsectionHeaderProps}
      failingLine={100}
      lineIndex={0}
      subsectionHeaderLine={{
        ...baseSubsectionHeaderLine,
        commandDescription: "Downloading MongoDB binary",
        isOpen: true,
      }}
    />
  </Container>
);
const SubsectionHeaderStoryTopLevel = () => (
  <Container>
    <SubsectionHeader
      {...subsectionHeaderProps}
      failingLine={5}
      lineIndex={0}
      subsectionHeaderLine={{
        ...baseSubsectionHeaderLine,
        isTopLevelCommand: true,
      }}
    />
    <SubsectionHeader
      {...subsectionHeaderProps}
      lineIndex={0}
      subsectionHeaderLine={{
        ...baseSubsectionHeaderLine,
        commandDescription: "Updating task expansions",
        isOpen: true,
        isTopLevelCommand: true,
      }}
    />
    <SubsectionHeader
      {...subsectionHeaderProps}
      failingLine={undefined}
      lineIndex={0}
      subsectionHeaderLine={{
        ...baseSubsectionHeaderLine,
        commandDescription: "Downloading MongoDB binary",
        isOpen: true,
        isTopLevelCommand: true,
      }}
    />
  </Container>
);
export const SubsectionHeaderNested: CustomStoryObj<typeof SubsectionHeader> = {
  render: () => <SubsectionHeaderStory />,
};

export const SubsectionHeaderTopLevel: CustomStoryObj<typeof SubsectionHeader> =
  {
    render: () => <SubsectionHeaderStoryTopLevel />,
  };

const Container = styled.div`
  height: 400px;
  width: 800px;
`;

const baseSubsectionHeaderLine = {
  commandDescription: undefined,
  commandID: "command-1",
  commandName: "shell.exec",
  functionID: "function-1",
  isOpen: false,
  isTopLevelCommand: false,
  range: { end: 10, start: 0 },
  rowType: RowType.SubsectionHeader as const,
  step: "1 of 4",
};

const subsectionHeaderProps = {
  failingLine: 11,
  lineIndex: 0,
  subsectionHeaderLine: baseSubsectionHeaderLine,
};
