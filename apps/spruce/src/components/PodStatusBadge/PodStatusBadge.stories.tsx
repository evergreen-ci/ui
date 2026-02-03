import styled from "@emotion/styled";
import { size } from "@evg-ui/lib/constants";
import { CustomStoryObj, CustomMeta } from "@evg-ui/lib/test_utils";

import { PodStatus } from "types/pod";
import PodStatusBadge from ".";

export default {
  component: PodStatusBadge,
} satisfies CustomMeta<typeof PodStatusBadge>;

export const Default: CustomStoryObj<typeof PodStatusBadge> = {
  render: () => (
    <Container>
      {Object.keys(PodStatus).map((status) => (
        <Wrapper key={`badge_${status}`}>
          {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
          <PodStatusBadge status={PodStatus[status]} />
        </Wrapper>
      ))}
    </Container>
  ),
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;
const Wrapper = styled.div`
  padding: ${size.xxs};
`;
