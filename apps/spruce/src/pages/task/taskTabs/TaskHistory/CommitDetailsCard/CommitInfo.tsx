import { useTaskHistoryAnalytics } from "analytics";
import { CommitSource } from "components/CommitSource";
import { TaskHistoryTask } from "../types";
import styles from "./CommitDetailsCard.module.css";

interface CommitInfoProps {
  isTrigger: boolean;
  task: TaskHistoryTask;
}

export const CommitInfo: React.FC<CommitInfoProps> = ({ isTrigger, task }) => {
  const { sendEvent } = useTaskHistoryAnalytics();
  const { id: taskId, version } = task;

  return (
    <div className={styles.row}>
      <CommitSource
        data-testid="task-link"
        isTrigger={isTrigger}
        onHashClick={() =>
          sendEvent({ name: "Clicked task link", "task.id": taskId })
        }
        showRepo
        version={version}
      />
    </div>
  );
};
