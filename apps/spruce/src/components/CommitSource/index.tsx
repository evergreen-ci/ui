import { skipToken, useQuery } from "@apollo/client/react";
import { Body } from "@via-ds/components";
import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import { RevisionLink } from "components/RevisionLink";
import { getTriggerRoute, getVersionRoute } from "constants/routes";
import {
  VersionUpstreamProjectQuery,
  VersionUpstreamProjectQueryVariables,
} from "gql/generated/types";
import { VERSION_UPSTREAM_PROJECT } from "gql/queries";
import styles from "./index.module.css";

interface CommitSourceProps {
  "data-testid"?: string;
  isTrigger: boolean;
  onHashClick?: () => void;
  onModuleClick?: () => void;
  showRepo?: boolean;
  version: {
    id: string;
    projectMetadata?: { owner: string; repo: string } | null;
    revision?: string | null;
  };
}

export const CommitSource: React.FC<CommitSourceProps> = ({
  "data-testid": dataTestId,
  isTrigger,
  onHashClick,
  onModuleClick,
  showRepo = false,
  version,
}) => {
  const { data } = useQuery<
    VersionUpstreamProjectQuery,
    VersionUpstreamProjectQueryVariables
  >(
    VERSION_UPSTREAM_PROJECT,
    isTrigger ? { variables: { versionId: version.id } } : skipToken,
  );
  const upstreamProject = data?.version?.upstreamProject;

  const project = isTrigger ? upstreamProject : version.projectMetadata;
  const revision = isTrigger ? upstreamProject?.revision : version.revision;

  return (
    <div className={styles.container}>
      <RevisionLink
        data-testid={dataTestId}
        onClick={onHashClick}
        revision={revision ?? ""}
        to={getVersionRoute(version.id)}
      />
      {showRepo && project?.owner && project.repo && (
        <>
          <Body>
            in {project.owner}/{project.repo}
          </Body>
          <span aria-hidden>&bull;</span>
        </>
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
