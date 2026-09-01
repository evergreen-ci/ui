import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { SortedTaskStatus, TaskStatus } from "@evg-ui/lib/types/task";
import styles from "./TaskBox.stories.module.css";
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
  <div className={styles.container}>
    {SortedTaskStatus.map((s) => (
      <TaskBox
        key={s}
        data-tooltip={args.hasTooltip ? `Task with status ${s}` : undefined}
        status={s as TaskStatus}
      />
    ))}
  </div>
);
