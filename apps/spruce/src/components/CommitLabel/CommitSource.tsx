import { Body } from "@via-ds/components";
import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import { RevisionLink } from "components/RevisionLink";
import { Requester } from "constants/requesters";
import { getTriggerRoute } from "constants/routes";
import { VersionTriggerInfoFragment } from "gql/generated/types";
import { getDisplayRevision } from "utils/string";
import styles from "./CommitSource.module.css";
import { RepoLink } from "./RepoLink";

interface CommitSourceProps {
  "data-testid"?: string;
  hashHref: string;
  onHashClick?: () => void;
  onModuleClick?: () => void;
  showRepo?: boolean;
  version: Pick<VersionTriggerInfoFragment, "upstreamProject"> & {
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
  const { projectMetadata, requester, revision, upstreamProject } = version;
  const isTrigger = requester === Requester.Trigger;
  const displayRevision = getDisplayRevision({ revision, upstreamProject });

  return (
    <div className={styles.container}>
      <RevisionLink
        data-testid={dataTestId}
        onClick={onHashClick}
        revision={displayRevision}
        to={hashHref}
      />
      {showRepo && (
        <RepoLink
          repo={isTrigger ? upstreamProject : projectMetadata}
          revision={displayRevision}
          showSeparator={isTrigger}
        />
      )}
      {isTrigger && upstreamProject && (
        <Body className={styles.text}>
          Triggered by:{" "}
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
        </Body>
      )}
    </div>
  );
};
