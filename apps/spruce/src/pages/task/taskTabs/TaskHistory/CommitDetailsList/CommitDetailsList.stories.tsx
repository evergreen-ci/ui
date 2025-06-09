import WithToastContext from "@evg-ui/lib/test_utils/toast-decorator";
import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { TaskQuery } from "gql/generated/types";
import { taskQuery } from "gql/mocks/taskData";
import { tasks } from "../testData";
import { groupTasks } from "../utils";
import CommitDetailsList from ".";

type CommitDetailsListType = React.ComponentProps<typeof CommitDetailsList> & {
  shouldCollapse: boolean;
};

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
} satisfies CustomMeta<CommitDetailsListType>;

export const Default: CustomStoryObj<TemplateProps> = {
  render: (args) => <Template {...args} />,
};
export const WithFilterApplied: CustomStoryObj<TemplateProps> = {
  render: (args) => <WithFilter {...args} />,
};

type TemplateProps = {
  shouldCollapse: boolean;
  loading: boolean;
};

const Template = (args: TemplateProps) => {
  const groupedTasks = groupTasks(tasks, {
    shouldCollapse: args.shouldCollapse,
    testFailureSearchTerm: null,
  });
  return (
    <CommitDetailsList
      currentTask={currentTask}
      loading={args.loading}
      tasks={groupedTasks}
    />
  );
};

const WithFilter = (args: TemplateProps) => {
  const groupedTasks = groupTasks(tasks, {
    shouldCollapse: args.shouldCollapse,
    testFailureSearchTerm: /e2e/,
  });
  return (
    <CommitDetailsList
      currentTask={currentTask}
      loading={args.loading}
      tasks={groupedTasks}
    />
  );
};

const currentTask: NonNullable<TaskQuery["task"]> = {
  ...taskQuery.task,
  id: tasks[0].id,
};
