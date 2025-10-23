import { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { useQueryParam } from "@evg-ui/lib/hooks";
import PopoverButton from "components/PopoverButton";
import { QueryParams, urlParseOptions } from "constants/queryParams";
import DetailsMenuCard from "./DetailsMenuCard";

const { green } = palette;

interface DetailsMenuProps {
  disabled?: boolean;
}
const DetailsMenu: React.FC<DetailsMenuProps> = ({ disabled, ...rest }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [lowerRange] = useQueryParam<undefined | number>(
    QueryParams.LowerRange,
    undefined,
    urlParseOptions,
  );
  const [upperRange] = useQueryParam<undefined | number>(
    QueryParams.UpperRange,
    undefined,
    urlParseOptions,
  );

  const buttonRef = useRef<HTMLButtonElement>(null);
  const detailsMenuRef = useRef<HTMLDivElement>(null);
  const glowTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Only glow if we have actual range values (not initial undefined state)
    // This naturally skips the first render when both values are undefined
    if (lowerRange === undefined && upperRange === undefined) return;

    // If the DetailsMenu is already visible, don't show the change animation
    if (detailsMenuRef.current !== null) return;

    const button = buttonRef.current;
    if (!button) return;

    // Clear any existing timeout
    if (glowTimeoutRef.current) {
      clearTimeout(glowTimeoutRef.current);
    }

    button.classList.add("glow-active");
    glowTimeoutRef.current = setTimeout(() => {
      button.classList.remove("glow-active");
    }, 2000);

    return () => {
      if (glowTimeoutRef.current) {
        clearTimeout(glowTimeoutRef.current);
      }
      button.classList.remove("glow-active");
    };
  }, [lowerRange, upperRange]);

  return (
    <AnimatedPopoverButton
      buttonRef={buttonRef}
      buttonText="Details"
      disabled={disabled}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      {...rest}
    >
      <DetailsMenuCard ref={detailsMenuRef} data-cy="details-menu" />
    </AnimatedPopoverButton>
  );
};

const AnimatedPopoverButton = styled(PopoverButton)`
  /* Glow animation */
  &.glow-active {
    animation: glow 1s ease-in-out infinite alternate;
  }

  @keyframes glow {
    from {
      box-shadow: 0 0 0px ${green.base};
    }
    to {
      box-shadow: 0 0 20px ${green.base};
    }
  }
`;

export default DetailsMenu;
