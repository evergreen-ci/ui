import styled from "@emotion/styled";
import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { SectionStatus } from "constants/logs";
import SubsectionHeader from ".";

export default {
  component: SubsectionHeader,
} satisfies CustomMeta<typeof SubsectionHeader>;

const SubsectionHeaderStory = () => (
  <Container>
    <SubsectionHeader
      {...SubsectionHeaderProps}
      commandName="shell.exec"
      isTopLevelCommand={false}
      lineIndex={0}
      open
      status={undefined}
    />
    <SubsectionHeader
      {...SubsectionHeaderProps}
      commandName="shell.exec"
      isTopLevelCommand={false}
      lineIndex={0}
      open={false}
      status={SectionStatus.Fail}
    />
    <SubsectionHeader
      {...SubsectionHeaderProps}
      commandName="shell.exec"
      isTopLevelCommand={false}
      lineIndex={0}
      open
      status={SectionStatus.Pass}
    />
  </Container>
);
const SubsectionHeaderStoryTopLevel = () => (
  <Container>
    <SubsectionHeader
      {...SubsectionHeaderProps}
      commandName="shell.exec"
      isTopLevelCommand
      lineIndex={0}
      open={false}
      status={SectionStatus.Fail}
    />
    <SubsectionHeader
      {...SubsectionHeaderProps}
      commandName="shell.exec"
      isTopLevelCommand
      lineIndex={0}
      open
      status={SectionStatus.Pass}
    />
    <SubsectionHeader
      {...SubsectionHeaderProps}
      commandName="shell.exec"
      isTopLevelCommand
      lineIndex={0}
      open
      status={undefined}
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

const SubsectionHeaderProps = {
  commandID: "command-1",
  functionID: "function-1",
  step: "1 of 4",
};
