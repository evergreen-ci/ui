import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import { useVersionAnalytics } from "analytics";
import { GithubCommitLink } from "components/GithubCommitLink";
import { MetadataItem, MetadataSection } from "components/MetadataCard";
import { RevisionLink } from "components/RevisionLink";
import { getTriggerRoute, getWaterfallRoute } from "constants/routes";
import { VersionQuery } from "gql/generated/types";
import { ProjectTriggerLevel } from "types/triggers";
import styles from "./index.module.css";

type UpstreamProjectType = NonNullable<
  NonNullable<VersionQuery["version"]>["upstreamProject"]
>;

interface UpstreamProjectProps {
  upstreamProject: UpstreamProjectType;
  versionId: string;
}

const UpstreamProject: React.FC<UpstreamProjectProps> = ({
  upstreamProject,
  versionId,
}) => {
  const { sendEvent } = useVersionAnalytics(versionId);
  const { owner, project, repo, revision, task, triggerType, version } =
    upstreamProject;

  const triggerLink = getTriggerRoute({
    triggerType,
    upstreamTask: task,
    upstreamVersion: version,
    upstreamRevision: revision,
    upstreamOwner: owner,
    upstreamRepo: repo,
  });

  const isTaskTrigger = triggerType === ProjectTriggerLevel.TASK && !!task;
  const isBuildTrigger = triggerType === ProjectTriggerLevel.BUILD;
  const isPushTrigger = triggerType === ProjectTriggerLevel.PUSH;

  return (
    <MetadataSection className={styles.section} title="Triggered By">
      <MetadataItem label="Project">
        <StyledRouterLink to={getWaterfallRoute(project)}>
          {project}
        </StyledRouterLink>
      </MetadataItem>
      {isTaskTrigger && (
        <MetadataItem label="Task">
          <StyledRouterLink to={triggerLink}>
            {task.displayName}
          </StyledRouterLink>
        </MetadataItem>
      )}
      {isBuildTrigger && (
        <MetadataItem label="Version">
          <RevisionLink
            data-testid="version-trigger-revision"
            revision={revision}
            to={triggerLink}
          />
        </MetadataItem>
      )}
      {isPushTrigger && (
        <MetadataItem label="Commit">
          <GithubCommitLink
            data-testid="version-github-commit"
            onClick={() =>
              sendEvent({ name: "Clicked metadata github commit link" })
            }
            owner={owner}
            repo={repo}
            revision={revision}
          />
        </MetadataItem>
      )}
    </MetadataSection>
  );
};

export default UpstreamProject;
