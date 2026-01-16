import { useQuery } from "@apollo/client/react";
import { Body } from "@leafygreen-ui/typography";
import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import { useWaterfallAnalytics } from "analytics";
import { getTriggerRoute } from "constants/routes";
import {
  VersionUpstreamProjectQuery,
  VersionUpstreamProjectQueryVariables,
} from "gql/generated/types";
import { VERSION_UPSTREAM_PROJECT } from "gql/queries";

const UpstreamProjectLink: React.FC<{
  versionId: string;
  commitType: "active" | "inactive";
}> = ({ commitType, versionId }) => {
  const { data } = useQuery<
    VersionUpstreamProjectQuery,
    VersionUpstreamProjectQueryVariables
  >(VERSION_UPSTREAM_PROJECT, {
    variables: { versionId },
  });
  const { sendEvent } = useWaterfallAnalytics();

  const upstreamProject = data?.version?.upstreamProject;
  if (!upstreamProject) {
    return null;
  }
  return (
    <Body>
      Triggered by:{" "}
      <StyledRouterLink
        onClick={() => {
          sendEvent({
            name: "Clicked commit label",
            "commit.type": commitType,
            link: "upstream project",
          });
        }}
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

export default UpstreamProjectLink;
