import { useTaskHistoryAnalytics } from "analytics";
import { CommitSource } from "components/CommitSource";
import { getTaskRoute } from "constants/routes";
import { TaskTab } from "types/task";
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
        hashHref={getTaskRoute(taskId, { tab: TaskTab.History })}
        isTrigger={isTrigger}
        onHashClick={() =>
          sendEvent({ name: "Clicked task link", "task.id": taskId })
        }
        repo={version.projectMetadata}
        revision={version.revision}
        versionId={version.id}
      />
    </div>
  );
};
