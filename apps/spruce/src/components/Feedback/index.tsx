import { useState } from "react";
import { Button } from "@via-ds/components/button";
import { Tooltip, TooltipRoot, TooltipTrigger } from "@via-ds/components";
import Icon from "@evg-ui/lib/components/Icon";
import { StyledLink } from "@evg-ui/lib/components/styles";
import {
  getJiraBugUrl,
  getJiraImprovementUrl,
} from "constants/externalResources";
import { useSpruceConfig } from "hooks";

export const Feedback: React.FC = () => {
  const spruceConfig = useSpruceConfig();
  const jiraHost = spruceConfig?.jira?.host;

  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const jiraBugUrl = getJiraBugUrl(jiraHost);
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const jiraImprovementUrl = getJiraImprovementUrl(jiraHost);

  const [tooltipOpen, setTooltipOpen] = useState(false);

  return (
    <TooltipRoot
      isOpen={tooltipOpen}
      onOpenChange={setTooltipOpen}
      side="left"
      align="end"
    >
      <TooltipTrigger>
        <Button
          aria-label="Show Feedback form"
          onPress={() => setTooltipOpen(!tooltipOpen)}
        >
          <Icon glyph="Megaphone" />
        </Button>
      </TooltipTrigger>
      <Tooltip>
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
    </TooltipRoot>
  );
};
