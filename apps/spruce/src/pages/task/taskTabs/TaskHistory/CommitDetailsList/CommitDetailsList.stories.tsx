import { useState } from "react";
import WithToastContext from "@evg-ui/lib/test_utils/toast-decorator";
import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { TaskQuery } from "gql/generated/types";
import { taskQuery } from "gql/mocks/taskData";
import { tasks } from "../testData";
import { expandVisibleInactiveTasks, groupTasks } from "../utils";
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
  const [visibleInactiveTasks, setVisibleInactiveTasks] = useState<Set<string>>(
    new Set(),
  );
  const groupedTasks = groupTasks(tasks, args.shouldCollapse);
  const addVisibileInactiveTaskGroup = (taskGroupId: string) => {
    const nextState = new Set(visibleInactiveTasks);
    nextState.add(taskGroupId);
    setVisibleInactiveTasks(nextState);
  };
  const removeVisibleInactiveTaskGroup = (taskGroupId: string) => {
    const nextState = new Set(visibleInactiveTasks);
    nextState.delete(taskGroupId);
    setVisibleInactiveTasks(nextState);
  };
  const commitDetailsTasks = expandVisibleInactiveTasks(
    groupedTasks,
    visibleInactiveTasks,
  );
  return (
    <CommitDetailsList
      addVisibleInactiveTaskGroup={addVisibileInactiveTaskGroup}
      currentTask={currentTask}
      loading={args.loading}
      removeVisibleInactiveTaskGroup={removeVisibleInactiveTaskGroup}
      shouldCollapse={args.shouldCollapse}
      tasks={commitDetailsTasks}
      visibleInactiveTasks={visibleInactiveTasks}
    />
  );
};

const currentTask: NonNullable<TaskQuery["task"]> = {
  ...taskQuery.task,
  id: tasks[0].id,
};
