import { CustomMeta, CustomStoryObj } from "test_utils/types";
import { TaskStatus, TaskStatusUmbrella } from "types/task";
import styles from "./TaskStatusBadge.stories.module.css";
import TaskStatusBadge from ".";

export default {
  component: TaskStatusBadge,
} satisfies CustomMeta<typeof TaskStatusBadge>;

const statuses = [
  ...Object.values(TaskStatus),
  ...Object.values(TaskStatusUmbrella),
];

export const Default: CustomStoryObj<typeof TaskStatusBadge> = {
  argTypes: {
    status: {
      control: "select",
      options: statuses,
    },
  },
  args: {
    status: TaskStatus.Succeeded,
  },
  render: (args) => <TaskStatusBadge {...args} />,
};

export const AllBadges: CustomStoryObj<typeof TaskStatusBadge> = {
  render: () => (
    <div className={styles.container}>
      {statuses.map((status) => (
        <TaskStatusBadge key={status} status={status} />
      ))}
    </div>
  ),
};

export const WithTaskCount: CustomStoryObj<typeof TaskStatusBadge> = {
  render: () => (
    <div className={styles.container}>
      {Object.values(TaskStatus).map((status) => (
        <TaskStatusBadge key={status} status={status} taskCount={2} />
      ))}
    </div>
  ),
};
