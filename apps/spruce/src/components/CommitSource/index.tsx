import { skipToken, useQuery } from "@apollo/client/react";
import { Body } from "@via-ds/components";
import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import { RevisionLink } from "components/RevisionLink";
import { getTriggerRoute } from "constants/routes";
import {
  VersionUpstreamProjectQuery,
  VersionUpstreamProjectQueryVariables,
} from "gql/generated/types";
import { VERSION_UPSTREAM_PROJECT } from "gql/queries";
import styles from "./index.module.css";

interface CommitSourceProps {
  "data-testid"?: string;
  hashHref: string;
  isTrigger: boolean;
  onHashClick?: () => void;
  onModuleClick?: () => void;
  repo?: { owner: string; repo: string } | null;
  revision: string;
  versionId: string;
}

export const CommitSource: React.FC<CommitSourceProps> = ({
  "data-testid": dataTestId,
  hashHref,
  isTrigger,
  onHashClick,
  onModuleClick,
  repo,
  revision,
  versionId,
}) => {
  const { data } = useQuery<
    VersionUpstreamProjectQuery,
    VersionUpstreamProjectQueryVariables
  >(
    VERSION_UPSTREAM_PROJECT,
    isTrigger ? { variables: { versionId } } : skipToken,
  );
  const upstreamProject = data?.version?.upstreamProject;

  return (
    <div className={styles.container}>
      <RevisionLink
        data-testid={dataTestId}
        onClick={onHashClick}
        revision={revision}
        to={hashHref}
      />
      {repo && (
        <Body>
          in {repo.owner}/{repo.repo}
        </Body>
      )}
      {repo && isTrigger && (
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
