import styled from "@emotion/styled";
import { CustomMeta, CustomStoryObj } from "test_utils/types";
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
  </Container>
);

export const SubsectionHeaderSingle: CustomStoryObj<typeof SubsectionHeader> = {
  render: () => <SubsectionHeaderStory />,
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
