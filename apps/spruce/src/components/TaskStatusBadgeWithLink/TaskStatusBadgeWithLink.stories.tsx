import styled from "@emotion/styled";
import { CustomStoryObj, CustomMeta } from "@evg-ui/lib/test_utils/types";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { size } from "constants/tokens";
import TaskStatusBadgeWithLink from ".";

export default {
  component: TaskStatusBadgeWithLink,
} satisfies CustomMeta<typeof TaskStatusBadgeWithLink>;

export const Default: CustomStoryObj<typeof TaskStatusBadgeWithLink> = {
  render: () => {
    // filter out umbrella statuses
    const taskStatuses = Object.values(TaskStatus).filter(
      (taskName) => !taskName.includes("Umbrella"),
    );
    return (
      <Container>
        {taskStatuses.map((status) => (
          <Wrapper key={`badge_${status}`}>
            <TaskStatusBadgeWithLink execution={0} id="1" status={status} />
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
