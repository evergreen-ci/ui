import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import { useVersionAnalytics } from "analytics";
import { GithubCommitLink } from "components/GithubCommitLink";
import { MetadataItem, MetadataSection } from "components/MetadataCard";
import { RevisionLink } from "components/RevisionLink";
import { getTriggerRoute, getWaterfallRoute } from "constants/routes";
import { VersionQuery } from "gql/generated/types";
import { ProjectTriggerLevel } from "types/triggers";

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

  return (
    <MetadataSection title="Triggered By">
      <MetadataItem label="Project">
        <StyledRouterLink to={getWaterfallRoute(project)}>
          {project}
        </StyledRouterLink>
      </MetadataItem>
      <MetadataItem label="Repo">
        {owner}/{repo}
      </MetadataItem>
      {triggerType === ProjectTriggerLevel.PUSH ? (
        <MetadataItem label="GitHub commit">
          <GithubCommitLink
            data-testid="version-github-commit"
            href={triggerLink}
            onClick={() =>
              sendEvent({ name: "Clicked metadata github commit link" })
            }
            revision={revision}
          />
        </MetadataItem>
      ) : (
        <MetadataItem
          label={triggerType === ProjectTriggerLevel.TASK ? "Task" : "Build"}
        >
          <RevisionLink
            data-testid="version-trigger-revision"
            revision={revision}
            to={triggerLink}
          />
        </MetadataItem>
      )}
    </MetadataSection>
  );
};

export default UpstreamProject;
