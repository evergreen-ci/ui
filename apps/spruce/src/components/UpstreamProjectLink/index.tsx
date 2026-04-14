import { skipToken, useQuery } from "@apollo/client/react";
import { Body } from "@leafygreen-ui/typography";
import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import { getTriggerRoute } from "constants/routes";
import {
  VersionUpstreamProjectQuery,
  VersionUpstreamProjectQueryVariables,
} from "gql/generated/types";
import { VERSION_UPSTREAM_PROJECT } from "gql/queries";

export const UpstreamProjectLink: React.FC<{
  versionId: string;
  isTrigger: boolean;
  onClick?: () => void;
}> = ({ isTrigger, onClick = () => {}, versionId }) => {
  const { data } = useQuery<
    VersionUpstreamProjectQuery,
    VersionUpstreamProjectQueryVariables
  >(
    VERSION_UPSTREAM_PROJECT,
    isTrigger
      ? {
          variables: { versionId },
        }
      : skipToken,
  );

  if (!isTrigger) {
    return null;
  }

  const upstreamProject = data?.version?.upstreamProject;
  if (!upstreamProject) {
    return null;
  }

  return (
    <Body>
      Triggered by:{" "}
      <StyledRouterLink
        onClick={onClick}
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
  );
};
