import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { tasks } from "../testData";
import { groupTasks } from "../utils";
import TaskTimeline from ".";

export default {
  component: TaskTimeline,
  args: {
    shouldCollapse: true,
  },
  argTypes: {
    shouldCollapse: {
      control: { type: "boolean" },
    },
  },
} satisfies CustomMeta<TemplateProps>;

export const Default: CustomStoryObj<TemplateProps> = {
  render: (args) => <Template shouldCollapse={args.shouldCollapse} />,
};

type TemplateProps = {
  shouldCollapse: boolean;
};

const Template = (args: TemplateProps) => {
  const groupedTasks = groupTasks(tasks, args.shouldCollapse);
  return <TaskTimeline groupedTasks={groupedTasks} loading={false} />;
};
