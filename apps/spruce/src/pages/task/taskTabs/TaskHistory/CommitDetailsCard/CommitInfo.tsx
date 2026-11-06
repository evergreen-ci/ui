import { useTaskHistoryAnalytics } from "analytics";
import { BasedOnVersion, CommitSource } from "components/CommitLabel";
import { Requester } from "constants/requesters";
import { getTaskRoute } from "constants/routes";
import { TaskTab } from "types/task";
import { TaskHistoryTask } from "../types";
import styles from "./CommitDetailsCard.module.css";

interface CommitInfoProps {
  task: TaskHistoryTask;
}

export const CommitInfo: React.FC<CommitInfoProps> = ({ task }) => {
  const { sendEvent } = useTaskHistoryAnalytics();
  const { id: taskId, requester, version } = task;
  const isTrigger = requester === Requester.Trigger;

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
      <BasedOnVersion isTrigger={isTrigger} showRepo versionId={version.id} />
    </div>
  );
};
