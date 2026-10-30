import { IconButton } from "@leafygreen-ui/icon-button";
import Icon from "@evg-ui/lib/components/Icon";
import { useTaskHistoryAnalytics } from "analytics";
import { RevisionLink } from "components/RevisionLink";
import { UpstreamProjectLink } from "components/UpstreamProjectLink";
import { getGithubCommitUrl } from "constants/externalResources";
import { getTaskRoute } from "constants/routes";
import { TaskTab } from "types/task";
import { useTaskHistoryContext } from "../context";
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

  const { currentTask } = useTaskHistoryContext();
  const owner = currentTask.project?.owner;
  const repo = currentTask.project?.repo;
  const githubCommitUrl =
    owner && repo && revision ? getGithubCommitUrl(owner, repo, revision) : "";

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
      {githubCommitUrl && (
        <IconButton
          aria-label="GitHub Commit Link"
          data-testid="github-link"
          href={githubCommitUrl}
          target="_blank"
        >
          <Icon glyph="GitHub" />
        </IconButton>
      )}
      {isTrigger && (
        <UpstreamProjectLink isTrigger={isTrigger} versionId={versionId} />
      )}
    </div>
  );
};
