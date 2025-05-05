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
  const [visibleInactiveTasks, setVisibleInactiveTasks] = useState<string[][]>(
    [],
  );
  const groupedTasks = groupTasks(tasks, args.shouldCollapse);
  const addVisibileInactiveTasks = (tasksToAdd: string[]) => {
    setVisibleInactiveTasks(visibleInactiveTasks.concat([tasksToAdd]));
  };
  const removeVisibleInactiveTasks = (tasksToRemove: string[]) => {
    setVisibleInactiveTasks((prev) =>
      prev.filter((taskGroup) => !taskGroup.includes(tasksToRemove[0])),
    );
  };
  const commitDetailsTasks = expandVisibleInactiveTasks(
    groupedTasks,
    visibleInactiveTasks,
  );
  return (
    <CommitDetailsList
      addVisibleInactiveTasks={addVisibileInactiveTasks}
      currentTask={currentTask}
      loading={args.loading}
      removeVisibleInactiveTasks={removeVisibleInactiveTasks}
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
