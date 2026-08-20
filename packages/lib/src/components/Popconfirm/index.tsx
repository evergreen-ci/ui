import { useEffect, useRef, useState } from "react";
import { Button, Size, Variant } from "@leafygreen-ui/button";
import { Align, Justify, Tooltip, TooltipProps } from "@leafygreen-ui/tooltip";
import styles from "./index.module.css";

export { Align, Justify };

type PopconfirmProps = Omit<
  TooltipProps,
  "onEnter" | "onEntering" | "onEntered" | "onExit" | "onExited" | "onExiting"
> & {
  confirmDisabled?: boolean;
  confirmText?: string;
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
      refEl={refEl}
      setOpen={setOpen}
      triggerEvent="click"
      {...props}
    >
      <div ref={popoverRef} className={styles.contentWrapper}>
        {children}
        <div className={styles.buttonWrapper}>
          <Button
            as="button"
            data-testid="popconfirm-cancel-button"
            onClick={() => {
              onClose();
              setOpen(false);
            }}
            size={Size.Small}
          >
            Cancel
          </Button>
          <Button
            as="button"
            data-testid="popconfirm-confirm-button"
            disabled={confirmDisabled}
            onClick={(e) => {
              onConfirm(e);
              setOpen(false);
            }}
            size={Size.Small}
            variant={Variant.Primary}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Tooltip>
  );
};

export default Popconfirm;
