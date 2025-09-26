import { useRef, useState } from "react";
import styled from "@emotion/styled";
import { GuideCue, TooltipAlign } from "@leafygreen-ui/guide-cue";
import { palette } from "@leafygreen-ui/palette";
import { Body, BodyProps } from "@leafygreen-ui/typography";
import { differenceInDays } from "date-fns";
import Cookies from "js-cookie";
import Icon from "@evg-ui/lib/components/Icon";
import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import { size } from "@evg-ui/lib/constants/tokens";
import { SEEN_TASK_REVIEW_TOOLTIP } from "constants/cookies";
import { PreferencesTabRoutes, getPreferencesRoute } from "constants/routes";

export const AnnouncementPopover: React.FC = () => {
  const now = new Date();
  const infoRef = useRef(null);

  const seenTaskReviewTooltipCookie: string | undefined = Cookies.get(
    SEEN_TASK_REVIEW_TOOLTIP,
  );
  const neverSeenTaskReviewTooltip = !seenTaskReviewTooltipCookie;
  const seenTaskReviewTooltipDate = seenTaskReviewTooltipCookie
    ? new Date(seenTaskReviewTooltipCookie)
    : now;

  const [open, setOpen] = useState(neverSeenTaskReviewTooltip);

  const close = () => {
    setOpen(false);

    if (neverSeenTaskReviewTooltip) {
      Cookies.set(
        SEEN_TASK_REVIEW_TOOLTIP,
        seenTaskReviewTooltipDate.toString(),
      );
    }
  };

  return neverSeenTaskReviewTooltip ||
    differenceInDays(now, seenTaskReviewTooltipDate) < 8 ? (
    <>
      <IconContainer ref={infoRef}>
        <Icon
          fill={palette.gray.dark2}
          glyph="InfoWithCircle"
          onClick={() => setOpen(true)}
        />
      </IconContainer>
      <GuideCue
        currentStep={1}
        numberOfSteps={1}
        onDismiss={close}
        onPrimaryButtonClick={close}
        open={open}
        refEl={infoRef}
        setOpen={setOpen}
        title="New feature: Task Review"
        tooltipAlign={TooltipAlign.Right}
      >
        <StyledBody>
          Mark unsuccessful tasks as reviewed when you&apos;re done looking at
          them. This state is not shared by your teammates and only helps with
          personal debugging on one machine.
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
      </GuideCue>
    </>
  ) : null;
};

const StyledBody = styled(Body)<BodyProps>`
  color: inherit;

  :not(:last-of-type) {
    margin-bottom: ${size.xs};
  }
`;

const IconContainer = styled.div`
  cursor: pointer;
  padding-left: ${size.xxs};
`;
