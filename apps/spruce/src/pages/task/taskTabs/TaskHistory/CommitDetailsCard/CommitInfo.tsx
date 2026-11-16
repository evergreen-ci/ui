import { useTaskHistoryAnalytics } from "analytics";
import { BasedOnVersion, RepoLabel, TriggeredBy } from "components/CommitLabel";
import { RevisionLink } from "components/RevisionLink";
import { getTaskRoute } from "constants/routes";
import { TaskTab } from "types/task";
import { getDisplayRevision } from "utils/string";
import { TaskHistoryTask } from "../types";
import styles from "./CommitDetailsCard.module.css";

interface CommitInfoProps {
  task: TaskHistoryTask;
}

export const CommitInfo: React.FC<CommitInfoProps> = ({ task }) => {
  const { sendEvent } = useTaskHistoryAnalytics();
  const { id: taskId, version } = task;
  const { upstreamProject } = version;

  return (
    <div className={styles.row}>
      <RevisionLink
        data-testid="task-link"
        onClick={() =>
          sendEvent({ name: "Clicked task link", "task.id": taskId })
        }
        revision={getDisplayRevision(version)}
        to={getTaskRoute(taskId, { tab: TaskTab.History })}
      />
      <RepoLabel version={version} />
      <TriggeredBy showSeparator upstreamProject={upstreamProject} />
      <BasedOnVersion
        baseVersion={upstreamProject?.baseVersion}
        showRepo
        showSeparator
      />
    </div>
  );
};
