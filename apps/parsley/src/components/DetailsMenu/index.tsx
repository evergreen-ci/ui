import { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { GuideCue } from "@leafygreen-ui/guide-cue";
import { palette } from "@leafygreen-ui/palette";
import Cookie from "js-cookie";
import PopoverButton from "components/PopoverButton";
import { HAS_SEEN_JUMP_TO_FAILING_LINE_GUIDE_CUE } from "constants/cookies";
import { QueryParams } from "constants/queryParams";
import { useQueryParam } from "hooks/useQueryParam";
import DetailsMenuCard from "./DetailsMenuCard";

const { green } = palette;

interface DetailsMenuProps {
  disabled?: boolean;
}
const DetailsMenu: React.FC<DetailsMenuProps> = ({ disabled, ...rest }) => {
  const [lowerRange] = useQueryParam<undefined | number>(
    QueryParams.LowerRange,
    undefined,
  );
  const [upperRange] = useQueryParam<undefined | number>(
    QueryParams.UpperRange,
    undefined,
  );
  const [changeVisible, setChangeVisible] = useState(false);

  const [openGuideCue, setOpenGuideCue] = useState(
    Cookie.get(HAS_SEEN_JUMP_TO_FAILING_LINE_GUIDE_CUE) !== "true",
  );

  const buttonRef = useRef<HTMLButtonElement>(null);
  const detailsMenuRef = useRef<HTMLDivElement>(null);
  const firstUpdate = useRef(true);

  useEffect(() => {
    // Don't show the change animation on the first render
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    // If the DetailsMenu is already visible, don't show the change animation
    if (detailsMenuRef.current !== null) return;
    setChangeVisible(true);
    const timer = setTimeout(() => {
      setChangeVisible(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [lowerRange, upperRange]);

  return (
    <>
      <AnimatedPopoverButton
        buttonRef={buttonRef}
        buttonText="Details"
        disabled={disabled}
        variant={changeVisible ? "primary" : "default"}
        {...rest}
      >
        <DetailsMenuCard ref={detailsMenuRef} data-cy="details-menu" />
      </AnimatedPopoverButton>
      {/* TODO: Remove in DEVPROD-6185. */}
      <GuideCue
        currentStep={1}
        data-cy="jump-to-failing-line-guide-cue"
        numberOfSteps={1}
        onPrimaryButtonClick={() => {
          Cookie.set(HAS_SEEN_JUMP_TO_FAILING_LINE_GUIDE_CUE, "true", {
            expires: 365,
          });
          setOpenGuideCue(false);
        }}
        open={openGuideCue}
        refEl={buttonRef}
        setOpen={setOpenGuideCue}
        title="Jump to Failing Line is Enabled"
        tooltipAlign="bottom"
        tooltipJustify="end"
      >
        A new feature <HighlightedText>Jump to Failing Line</HighlightedText>{" "}
        has been enabled for all users by default. Toggle it on or off via the
        menu.
      </GuideCue>
    </>
  );
};

const AnimatedPopoverButton = styled(PopoverButton)`
  /* Glow animation */
  ${({ variant }) =>
    variant === "primary" &&
    `
    animation: glow 1s ease-in-out infinite alternate;
    @keyframes glow {
      from {
        box-shadow: 0 0 0px ${green.base};
      }
      to {
        box-shadow: 0 0 20px ${green.base};
      }
    }
  `}
`;

const HighlightedText = styled.span`
  color: ${green.base};
`;

export default DetailsMenu;
