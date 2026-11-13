import { useTaskHistoryAnalytics } from "analytics";
import { CommitSource } from "components/CommitLabel";
import { getTaskRoute } from "constants/routes";
import { TaskTab } from "types/task";
import { TaskHistoryTask } from "../types";
import styles from "./CommitDetailsCard.module.css";

interface CommitInfoProps {
  task: TaskHistoryTask;
}

export const CommitInfo: React.FC<CommitInfoProps> = ({ task }) => {
  const { sendEvent } = useTaskHistoryAnalytics();
  const { id: taskId, version } = task;

  return (
    <div className={styles.row}>
      <CommitSource
        data-testid="task-link"
        hashHref={getTaskRoute(taskId, { tab: TaskTab.History })}
        onHashClick={() =>
          sendEvent({ name: "Clicked task link", "task.id": taskId })
        }
        showRepo
        version={version}
      />
    </div>
  );
};
