import { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import Tooltip, { TooltipProps } from "@leafygreen-ui/tooltip";
import { size, zIndex } from "../../constants/tokens";
import { wordBreakCss } from "../styles";

type PopconfirmProps = Omit<
  TooltipProps,
  "onEnter" | "onEntering" | "onEntered" | "onExit" | "onExited" | "onExiting"
> & {
  confirmDisabled?: boolean;
  confirmText?: string;
  "data-cy"?: string;
  onConfirm?: (e?: React.MouseEvent) => void;
  children: React.ReactNode;
};

const Popconfirm: React.FC<PopconfirmProps> = ({
  children,
  confirmDisabled = false,
  confirmText = "Yes",
  onClose = () => {},
  onConfirm = () => {},
  open: controlledOpen,
  refEl,
  setOpen: controlledSetOpen,
  ...props
}) => {
  const isControlled = !!(controlledOpen !== undefined && controlledSetOpen);
  const [uncontrolledOpen, uncontrolledSetOpen] = useState(false);
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const setOpen = isControlled ? controlledSetOpen : uncontrolledSetOpen;

  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        (!refEl ||
          (refEl &&
            refEl instanceof HTMLElement &&
            refEl.contains(event.target as Node)))
      ) {
        onClose();
        setOpen(false);
      }
    };

    if (typeof window !== "undefined" && open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [open, onClose, setOpen, refEl]);

  return (
    <Tooltip
      onClose={onClose}
      open={open}
      popoverZIndex={zIndex.popover}
      refEl={refEl}
      setOpen={setOpen}
      triggerEvent="click"
      {...props}
    >
      <ContentWrapper ref={popoverRef}>
        {children}
        <ButtonWrapper>
          <Button
            onClick={() => {
              onClose();
              setOpen(false);
            }}
            size="small"
          >
            Cancel
          </Button>
          <Button
            disabled={confirmDisabled}
            onClick={(e) => {
              onConfirm(e);
              setOpen(false);
            }}
            size="small"
            variant="primary"
          >
            {confirmText}
          </Button>
        </ButtonWrapper>
      </ContentWrapper>
    </Tooltip>
  );
};

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${size.xs};

  ${wordBreakCss}
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-self: flex-end;
  margin-top: ${size.xs};
  gap: ${size.xxs};
`;

export default Popconfirm;
