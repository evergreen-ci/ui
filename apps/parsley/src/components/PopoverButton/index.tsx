import { RefObject, useCallback, useRef } from "react";
import { Button, ButtonProps } from "@leafygreen-ui/button";
import { Card } from "@leafygreen-ui/card";
import { Popover } from "@leafygreen-ui/popover";
import { Icon } from "@evg-ui/lib/components";
import { useOnClickOutside } from "@evg-ui/lib/hooks";

interface PopoverButtonProps extends Omit<ButtonProps, "children"> {
  children: React.ReactNode;
  onClick?: () => void;
  buttonText: React.ReactNode | string;
  buttonRef: RefObject<HTMLButtonElement>;
  disableOutsideClick?: boolean;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const PopoverButton: React.FC<PopoverButtonProps> = ({
  buttonRef,
  buttonText,
  children,
  disableOutsideClick,
  isOpen,
  onClick,
  setIsOpen,
  variant,
  ...rest
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  const onOutsideClick = useCallback(() => {
    if (disableOutsideClick) return;
    setIsOpen(false);
  }, [disableOutsideClick, setIsOpen]);

  useOnClickOutside([buttonRef, popoverRef], onOutsideClick);

  const handleClick = () => {
    setIsOpen(!isOpen);
    onClick?.();
  };

  return (
    <Button
      ref={buttonRef}
      data-variant={variant}
      onClick={handleClick}
      rightGlyph={<Icon glyph="CaretDown" />}
      size="small"
      variant={variant}
      {...rest}
    >
      {buttonText}
      <Popover
        active={isOpen}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <div ref={popoverRef}>
          <Card>{children}</Card>
        </div>
      </Popover>
    </Button>
  );
};

export default PopoverButton;
