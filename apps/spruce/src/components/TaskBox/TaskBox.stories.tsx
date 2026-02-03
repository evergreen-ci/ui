import styled from "@emotion/styled";
import { size } from "@evg-ui/lib/constants";
import { CustomStoryObj, CustomMeta } from "@evg-ui/lib/test_utils";
import { SortedTaskStatus, TaskStatus } from "@evg-ui/lib/types";
import { TaskBox } from ".";

export default {
  title: "Components/Task Box",
  component: TaskBox,
} satisfies CustomMeta<typeof TaskBox>;

export const Default: CustomStoryObj<TemplateProps> = {
  render: (args) => <Template {...args} />,
  args: {
    hasTooltip: true,
    rightmost: false,
  },
  argTypes: {
    hasTooltip: {
      control: { type: "boolean" },
    },
    rightmost: {
      control: { type: "boolean" },
    },
  },
};

type TemplateProps = {
  hasTooltip: boolean;
  rightmost: boolean;
};

const Template = (args: TemplateProps) => (
  <Container>
    {SortedTaskStatus.map((s) => (
      <TaskBox
        key={s}
        rightmost={args.rightmost}
        status={s as TaskStatus}
        tooltip={args.hasTooltip ? `Task with status ${s}` : ""}
      />
    ))}
  </Container>
);

// Orient task boxes in the center of the frame to make space for tooltip.
const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${size.xs};

  height: 90vh;
  width: 100vw;
`;
