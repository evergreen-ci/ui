import styled from "@emotion/styled";
import { Size } from "@evg-ui/lib/components";
import { size } from "@evg-ui/lib/constants";
import { CustomStoryObj, CustomMeta } from "@evg-ui/lib/test_utils";
import { TaskStatus } from "@evg-ui/lib/types";
import { TaskStatusIcon, TaskStatusIconProps } from ".";

const Sizes = {
  [Size.Small]: 14,
  [Size.Default]: 16,
  [Size.Large]: 20,
  [Size.XLarge]: 24,
};

export default {
  title: "Components/Icon/Task Status",
  component: TaskStatusIcon,
} satisfies CustomMeta<typeof TaskStatusIcon>;

export const Default: CustomStoryObj<TaskStatusIconProps> = {
  render: ({ size: s }) => {
    // filter out umbrella statuses
    const taskStatuses = Object.keys(TaskStatus).filter(
      (taskName) => !taskName.includes("Umbrella"),
    );
    return (
      <Container>
        {taskStatuses.map((status) => (
          <IconContainer key={status}>
            {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
            <TaskStatusIcon size={s} status={TaskStatus[status]} />
            <span>{status}</span>
          </IconContainer>
        ))}
      </Container>
    );
  },
  args: {
    size: Sizes[Size.Default],
  },
  argTypes: {
    size: {
      options: Object.values(Sizes),
      control: { type: "select" },
    },
  },
};

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
const IconContainer = styled.div`
  width: 150px;
  height: 70px;
  flex-shrink: 0;
  text-align: center;
  border: 1px solid #babdbe;
  border-radius: ${size.xxs};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 0.5rem;
`;
