import { useRef, useState } from "react";
import styled from "@emotion/styled";
import { GuideCue, GuideCueProps } from "@leafygreen-ui/guide-cue";
import { palette } from "@leafygreen-ui/palette";
import { differenceInDays } from "date-fns";
import Cookies from "js-cookie";
import { size } from "../../constants/tokens";
import Icon from "../Icon";

type Props = {
  activeDays?: number;
  cookieName: string;
  loading?: boolean;
};

export const ExpiringAnnouncementTooltip: React.FC<
  Props & Pick<GuideCueProps, "children" | "title" | "tooltipAlign">
> = ({ activeDays = 8, cookieName, loading = false, ...guideCueProps }) => {
  const now = new Date();
  const infoRef = useRef(null);

  const seenTooltipCookie: string | undefined = Cookies.get(cookieName);
  const neverSeenTooltip = !seenTooltipCookie;
  const seenTooltipDate = seenTooltipCookie ? new Date(seenTooltipCookie) : now;

  const [open, setOpen] = useState(neverSeenTooltip);

  const close = () => {
    setOpen(false);

    if (neverSeenTooltip) {
      Cookies.set(cookieName, seenTooltipDate.toString(), { expires: 365 });
    }
  };

  return !loading &&
    (neverSeenTooltip ||
      differenceInDays(now, seenTooltipDate) < activeDays) ? (
    <>
      <IconContainer ref={infoRef}>
        <Icon
          data-cy="announcement-tooltip-trigger"
          fill={palette.gray.dark2}
          glyph="InfoWithCircle"
          onClick={() => setOpen((o) => !o)}
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
        {...guideCueProps}
      />
    </>
  ) : null;
};

const IconContainer = styled.div`
  cursor: pointer;
  padding-left: ${size.xxs};
`;
