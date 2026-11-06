import { skipToken, useQuery } from "@apollo/client/react";
import { Body } from "@via-ds/components";
import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import { RevisionLink } from "components/RevisionLink";
import { Requester } from "constants/requesters";
import { getTriggerRoute } from "constants/routes";
import {
  VersionUpstreamProjectQuery,
  VersionUpstreamProjectQueryVariables,
} from "gql/generated/types";
import { VERSION_UPSTREAM_PROJECT } from "gql/queries";
import { getDisplayRevision } from "utils/string";
import styles from "./CommitSource.module.css";

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

  const { data } = useQuery<
    VersionUpstreamProjectQuery,
    VersionUpstreamProjectQueryVariables
  >(
    VERSION_UPSTREAM_PROJECT,
    isTrigger ? { variables: { versionId: id } } : skipToken,
  );
  const upstreamProject = data?.version?.upstreamProject;
  const displayRepo = showRepo ? (upstreamProject ?? projectMetadata) : null;

  return (
    <div className={styles.container}>
      <RevisionLink
        data-testid={dataTestId}
        onClick={onHashClick}
        revision={getDisplayRevision({ revision, upstreamProject })}
        to={hashHref}
      />
      {displayRepo && (
        <Body>
          in {displayRepo.owner}/{displayRepo.repo}
        </Body>
      )}
      {displayRepo && isTrigger && (
        <span aria-hidden data-testid="separator">
          &middot;
        </span>
      )}
      {isTrigger && (
        <Body>
          Module:{" "}
          {upstreamProject && (
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
          )}
        </Body>
      )}
    </div>
  );
};
