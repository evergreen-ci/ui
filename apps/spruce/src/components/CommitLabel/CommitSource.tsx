import { Body } from "@via-ds/components";
import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import { RevisionLink } from "components/RevisionLink";
import { Requester } from "constants/requesters";
import { getTriggerRoute } from "constants/routes";
import { getDisplayRevision } from "utils/string";
import styles from "./CommitSource.module.css";
import { LoadingText } from "./LoadingText";
import { RepoLink } from "./RepoLink";
import { useVersionTriggerInfo } from "./useVersionTriggerInfo";

const MODULE_PLACEHOLDER = "evergreen";

interface CommitSourceProps {
  "data-testid"?: string;
  hashHref: string;
  onHashClick?: () => void;
  onModuleClick?: () => void;
  showRepo?: boolean;
  version: {
    id: string;
    projectMetadata?: { owner: string; repo: string } | null;
    requester: string;
    revision: string;
  };
}

export const CommitSource: React.FC<CommitSourceProps> = ({
  "data-testid": dataTestId,
  hashHref,
  onHashClick,
  onModuleClick,
  showRepo = false,
  version,
}) => {
  const { id, projectMetadata, requester, revision } = version;
  const isTrigger = requester === Requester.Trigger;
  const { loading, upstreamProject } = useVersionTriggerInfo(isTrigger, id);
  const displayRevision = getDisplayRevision({ revision, upstreamProject });

  if (!isTrigger) {
    return (
      <div className={styles.container}>
        <RevisionLink
          data-testid={dataTestId}
          onClick={onHashClick}
          revision={displayRevision}
          to={hashHref}
        />
        {showRepo && (
          <RepoLink repo={projectMetadata} revision={displayRevision} />
        )}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <RevisionLink
        data-testid={dataTestId}
        isLoading={loading}
        onClick={onHashClick}
        revision={displayRevision}
        to={hashHref}
      />
      {showRepo && (
        <RepoLink
          isLoading={loading}
          repo={upstreamProject}
          revision={displayRevision}
          showSeparator
        />
      )}
      <Body className={styles.text}>
        Triggered by:{" "}
        {upstreamProject ? (
          <StyledRouterLink
            onClick={onModuleClick}
            to={getTriggerRoute({
              triggerType: upstreamProject.triggerType,
              upstreamTask: upstreamProject.task,
              upstreamVersion: upstreamProject.version,
              upstreamRevision: upstreamProject.revision,
              upstreamOwner: upstreamProject.owner,
              upstreamRepo: upstreamProject.repo,
            })}
          >
            {upstreamProject.project}
          </StyledRouterLink>
        ) : (
          <LoadingText placeholder={MODULE_PLACEHOLDER} />
        )}
      </Body>
    </div>
  );
};
