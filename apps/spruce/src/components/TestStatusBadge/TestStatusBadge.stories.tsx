import Styled from "@emotion/styled";
import { size } from "@evg-ui/lib/constants/tokens";
import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { TestStatus } from "@evg-ui/lib/types/test";
import TestStatusBadge from ".";

export default {
  component: TestStatusBadge,
} satisfies CustomMeta<typeof TestStatusBadge>;

export const Default: CustomStoryObj<typeof TestStatusBadge> = {
  render: (args) => (
    <Container>
      {Object.values(TestStatus).map((status) => (
        <TestStatusBadge {...args} key={status} status={status} />
      ))}
    </Container>
  ),
  argTypes: {},
  args: {},
};

const Container = Styled.div`
    display: flex;
    gap: ${size.s};
`;
