import styled from "@emotion/styled";
import { TooltipAlign } from "@leafygreen-ui/guide-cue";
import { Body } from "@leafygreen-ui/typography";
import { ExpiringAnnouncementTooltip } from "@evg-ui/lib/components/ExpiringAnnouncementTooltip";
import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import { size } from "@evg-ui/lib/constants/tokens";
import { SEEN_TASK_REVIEW_TOOLTIP } from "constants/cookies";
import { PreferencesTabRoutes, getPreferencesRoute } from "constants/routes";

export const AnnouncementPopover: React.FC<{ loading?: boolean }> = ({
  loading = false,
}) => (
  <ExpiringAnnouncementTooltip
    cookieName={SEEN_TASK_REVIEW_TOOLTIP}
    loading={loading}
    title="New feature: Task Review"
    tooltipAlign={TooltipAlign.Right}
  >
    <StyledBody>
      Mark unsuccessful tasks as reviewed when you&apos;re done looking at them.
      This state is not shared by your teammates and only helps with personal
      debugging on one machine.
    </StyledBody>

    <StyledBody>
      You can disable this feature in your{" "}
      <StyledRouterLink
        to={getPreferencesRoute(PreferencesTabRoutes.UISettings)}
      >
        UI Settings
      </StyledRouterLink>
      .
    </StyledBody>
  </ExpiringAnnouncementTooltip>
);

const StyledBody = styled(Body)`
  color: inherit;

  :not(:last-of-type) {
    margin-bottom: ${size.xs};
  }
`;
