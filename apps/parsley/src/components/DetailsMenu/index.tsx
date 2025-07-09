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
  const [changeVisible, setChangeVisible] = useState(false);

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
    <AnimatedPopoverButton
      buttonRef={buttonRef}
      buttonText="Details"
      disabled={disabled}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      variant={changeVisible ? "primary" : "default"}
      {...rest}
    >
      <DetailsMenuCard ref={detailsMenuRef} data-cy="details-menu" />
    </AnimatedPopoverButton>
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

export default DetailsMenu;
