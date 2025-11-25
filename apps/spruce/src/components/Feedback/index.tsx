import { IconButton } from "@leafygreen-ui/icon-button";
import { palette } from "@leafygreen-ui/palette";
import { Tooltip } from "@leafygreen-ui/tooltip";
import Icon from "@evg-ui/lib/components/Icon";
import { StyledLink } from "@evg-ui/lib/components/styles";
import {
  getJiraBugUrl,
  getJiraImprovementUrl,
} from "constants/externalResources";
import { useSpruceConfig } from "hooks";

const { green } = palette;

export const Feedback: React.FC = () => {
  const spruceConfig = useSpruceConfig();
  const jiraHost = spruceConfig?.jira?.host;

  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const jiraBugUrl = getJiraBugUrl(jiraHost);
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const jiraImprovementUrl = getJiraImprovementUrl(jiraHost);

  return (
    <Tooltip
      align="left"
      justify="end"
      trigger={
        <IconButton aria-label="Show Feedback form">
          <Icon color={green.dark1} glyph="Megaphone" />
        </IconButton>
      }
      triggerEvent="click"
    >
      Feedback for the Evergreen team?{" "}
      <StyledLink href={jiraImprovementUrl} target="_blank">
        Suggest an improvement
      </StyledLink>{" "}
      or{" "}
      <StyledLink href={jiraBugUrl} target="_blank">
        report a bug
      </StyledLink>
      .
    </Tooltip>
  );
};
