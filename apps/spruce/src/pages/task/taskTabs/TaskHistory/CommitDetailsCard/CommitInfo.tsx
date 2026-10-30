import { useTaskHistoryAnalytics } from "analytics";
import { RevisionLink } from "components/RevisionLink";
import { UpstreamProjectLink } from "components/UpstreamProjectLink";
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

  const { id: taskId, revision, version } = task;
  const { id: versionId } = version;

  return (
    <div className={styles.row}>
      <RevisionLink
        data-testid="task-link"
        onClick={() =>
          sendEvent({ name: "Clicked task link", "task.id": taskId })
        }
        revision={revision ?? ""}
        to={getTaskRoute(taskId, { tab: TaskTab.History })}
      />
      {isTrigger && (
        <UpstreamProjectLink isTrigger={isTrigger} versionId={versionId} />
      )}
    </div>
  );
};
