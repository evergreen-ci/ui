import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { TaskQuery } from "gql/generated/types";
import { taskQuery } from "gql/mocks/taskData";
import { TaskHistoryContextProvider } from "../context";
import { tasks } from "../testData";
import { groupTasks } from "../utils";
import TaskTimeline from ".";

type TaskTimelineType = React.ComponentProps<typeof TaskTimeline> & {
  shouldCollapse: boolean;
};

export default {
  component: TaskTimeline,
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
} satisfies CustomMeta<TaskTimelineType>;

export const Default: CustomStoryObj<TemplateProps> = {
  render: (args) => <Template {...args} />,
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
    <TaskHistoryContextProvider task={currentTask}>
      <TaskTimeline
        loading={args.loading}
        pagination={{
          mostRecentTaskOrder: 10,
          oldestTaskOrder: 1,
          nextPageCursor: null,
          prevPageCursor: null,
        }}
        tasks={groupedTasks}
      />
    </TaskHistoryContextProvider>
  );
};

const currentTask: NonNullable<TaskQuery["task"]> = {
  ...taskQuery.task,
  id: tasks[0].id,
};
