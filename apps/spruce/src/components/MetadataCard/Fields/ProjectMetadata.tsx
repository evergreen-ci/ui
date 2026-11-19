import { Badge, BadgeVariant } from "@via-ds/components/badge";
import {
  Tooltip,
  TooltipRoot,
  TooltipTrigger,
} from "@via-ds/components/tooltip";
import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import { MetadataItem } from "components/MetadataCard";
import { getWaterfallRoute } from "constants/routes";
import { Project } from "gql/generated/types";

type ProjectProps = Pick<
  Project,
  "enabled" | "id" | "identifier" | "owner" | "repo"
> & {
  handleClick: () => void;
};

export const ProjectMetadata: React.FC<ProjectProps> = ({
  enabled,
  handleClick,
  id,
  identifier,
  owner,
  repo,
}) => (
  <MetadataItem label="Project">
    <StyledRouterLink
      onClick={handleClick}
      to={getWaterfallRoute(identifier || id || "")}
    >
      {identifier || `${owner}/${repo}`}
    </StyledRouterLink>{" "}
    {enabled ? null : (
      <TooltipRoot>
        <TooltipTrigger>
          <Badge variant={BadgeVariant.Error}>Disabled</Badge>
        </TooltipTrigger>
        <Tooltip>Disabled projects are unable to run tasks.</Tooltip>
      </TooltipRoot>
    )}
  </MetadataItem>
);
