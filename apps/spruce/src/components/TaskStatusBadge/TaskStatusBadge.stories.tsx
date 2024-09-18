import styled from "@emotion/styled";
import { CustomStoryObj, CustomMeta } from "@evg-ui/lib/test_utils/types";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { size } from "constants/tokens";

import TaskStatusBadge from "./index";

export default {
  component: TaskStatusBadge,
} satisfies CustomMeta<typeof TaskStatusBadge>;

export const Default: CustomStoryObj<typeof TaskStatusBadge> = {
  render: () => {
    // filter out umbrella statuses
    const taskStatuses = Object.keys(TaskStatus).filter(
      (taskName) => !taskName.includes("Umbrella"),
    );
    return (
      <Container>
        {taskStatuses.map((status) => (
          <Wrapper key={`badge_${status}`}>
            {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
            <TaskStatusBadge status={TaskStatus[status]} />
          </Wrapper>
        ))}
      </Container>
    );
  },
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;
const Wrapper = styled.div`
  padding: ${size.xxs};
`;
