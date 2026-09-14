import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { TaskStatus } from "@evg-ui/lib/types/task";
import styles from "./TaskStatusBadgeWithLink.stories.module.css";
import TaskStatusBadgeWithLink from ".";

export default {
  component: TaskStatusBadgeWithLink,
} satisfies CustomMeta<typeof TaskStatusBadgeWithLink>;

export const Default: CustomStoryObj<typeof TaskStatusBadgeWithLink> = {
  render: () => {
    const taskStatuses = Object.values(TaskStatus);
    return (
      <div className={styles.container}>
        {taskStatuses.map((status) => (
          <div key={`badge_${status}`} className={styles.wrapper}>
            <TaskStatusBadgeWithLink execution={0} id="1" status={status} />
          </div>
        ))}
      </div>
    );
  },
};
