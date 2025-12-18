import WithToastContext from "@evg-ui/lib/test_utils/toast-decorator";
import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { TaskQuery } from "gql/generated/types";
import { taskQuery } from "gql/mocks/taskData";
import { TaskHistoryContextProvider } from "../context";
import { tasks } from "../testData";
import InactiveCommitsButton from ".";

export default {
  component: InactiveCommitsButton,
  decorators: [(Story: () => React.JSX.Element) => WithToastContext(Story)],
} satisfies CustomMeta<typeof InactiveCommitsButton>;

export const Default: CustomStoryObj<typeof InactiveCommitsButton> = {
  render: () => <Template />,
};

const Template = () => (
  <TaskHistoryContextProvider baseTaskId="" isPatch={false} task={currentTask}>
    <InactiveCommitsButton inactiveTasks={tasks} />
  </TaskHistoryContextProvider>
);

const currentTask: NonNullable<TaskQuery["task"]> = {
  ...taskQuery.task,
  id: tasks[0].id,
};
