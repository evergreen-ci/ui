import WithToastContext from "@evg-ui/lib/test_utils/toast-decorator";
import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { TaskQuery } from "gql/generated/types";
import { taskQuery } from "gql/mocks/taskData";
import { tasks } from "../testData";
import { groupTasks } from "../utils";
import CommitDetailsList from ".";

export default {
  component: CommitDetailsList,
  decorators: [(Story: () => JSX.Element) => WithToastContext(Story)],
  args: {
    shouldCollapse: true,
    loading: false,
  },
  argTypes: {
    shouldCollapse: {
      control: { type: "boolean" },
    },
    loading: {
      control: { type: "boolean" },
    },
  },
} satisfies CustomMeta<TemplateProps>;

export const Default: CustomStoryObj<TemplateProps> = {
  render: (args) => <Template {...args} />,
};

type TemplateProps = {
  shouldCollapse: boolean;
  loading: boolean;
};

const Template = (args: TemplateProps) => {
  const groupedTasks = groupTasks(tasks, args.shouldCollapse);
  return (
    <CommitDetailsList
      currentTask={currentTask}
      loading={args.loading}
      shouldCollapse={args.shouldCollapse}
      tasks={groupedTasks}
    />
  );
};

const currentTask: NonNullable<TaskQuery["task"]> = {
  ...taskQuery.task,
  id: tasks[0].id,
};
