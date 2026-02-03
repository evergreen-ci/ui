import styled from "@emotion/styled";
import { size } from "@evg-ui/lib/constants";
import { CustomStoryObj, CustomMeta } from "@evg-ui/lib/test_utils";

import { HostStatus } from "types/host";
import HostStatusBadge from ".";

export default {
  component: HostStatusBadge,
} satisfies CustomMeta<typeof HostStatusBadge>;

export const Default: CustomStoryObj<typeof HostStatusBadge> = {
  render: () => (
    <Container>
      {Object.keys(HostStatus).map((status) => (
        <Wrapper key={`badge_${status}`}>
          {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
          <HostStatusBadge status={HostStatus[status]} />
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
