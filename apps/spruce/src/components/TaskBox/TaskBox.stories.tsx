import styled from "@emotion/styled";
import { size } from "@evg-ui/lib/constants/tokens";
import { CustomStoryObj, CustomMeta } from "@evg-ui/lib/test_utils/types";
import { SortedTaskStatus, TaskStatus } from "@evg-ui/lib/types/task";
import { TaskBox } from ".";

export default {
  title: "Components/Task Box",
  component: TaskBox,
} satisfies CustomMeta<typeof TaskBox>;

export const Default: CustomStoryObj<TemplateProps> = {
  render: (args) => <Template {...args} />,
  args: {
    hasTooltip: true,
  },
  argTypes: {
    hasTooltip: {
      control: { type: "boolean" },
    },
  },
};

type TemplateProps = {
  hasTooltip: boolean;
};

const Template = (args: TemplateProps) => (
  <Container>
    {SortedTaskStatus.map((s) => (
      <TaskBox
        key={s}
        data-tooltip={args.hasTooltip ? `Task with status ${s}` : undefined}
        status={s as TaskStatus}
      />
    ))}
  </Container>
);

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${size.xs};

  height: 90vh;
  width: 100vw;
`;
