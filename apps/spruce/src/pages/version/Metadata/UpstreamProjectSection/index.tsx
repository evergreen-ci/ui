import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import { useVersionAnalytics } from "analytics";
import { GithubCommitLink } from "components/GithubCommitLink";
import { MetadataItem, MetadataSection } from "components/MetadataCard";
import { RevisionLink } from "components/RevisionLink";
import { getTriggerRoute, getWaterfallRoute } from "constants/routes";
import { Version } from "pages/version/Metadata/types";
import { ProjectTriggerLevel } from "types/triggers";

interface UpstreamProjectSectionProps {
  version: Version;
}

export const UpstreamProjectSection: React.FC<UpstreamProjectSectionProps> = ({
  version,
}) => {
  const { sendEvent } = useVersionAnalytics(version.id);
  const { upstreamProject } = version;

  if (!upstreamProject) {
    return null;
  }

  const {
    owner,
    project,
    repo,
    revision,
    task,
    triggerType,
    version: upstreamVersion,
  } = upstreamProject;

  const triggerLink = getTriggerRoute({
    triggerType,
    upstreamTask: task,
    upstreamVersion,
    upstreamRevision: revision,
    upstreamOwner: owner,
    upstreamRepo: repo,
  });

  const isTaskTrigger = triggerType === ProjectTriggerLevel.TASK && !!task;
  const isBuildTrigger = triggerType === ProjectTriggerLevel.BUILD;
  const isPushTrigger = triggerType === ProjectTriggerLevel.PUSH;

  return (
    <MetadataSection title="Triggered By">
      <MetadataItem label="Project">
        <StyledRouterLink to={getWaterfallRoute(project, { revision })}>
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
        <MetadataItem>
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
