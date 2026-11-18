import { useCallback, useRef, useState } from "react";
import LeafyGreenProvider from "@leafygreen-ui/leafygreen-provider";
import { Button } from "@via-ds/components/button";
import { Popover, PopoverRoot } from "@via-ds/components/popover";
import { cx } from "../../utils/css";
import { PopoverContainer } from "../styles/Popover";
import styles from "./index.module.css";

export const Align = {
  Top: "top",
  Bottom: "bottom",
  Left: "left",
  Right: "right",
} as const;
export type Align = (typeof Align)[keyof typeof Align];

export const Justify = {
  Start: "start",
  Middle: "middle",
  End: "end",
} as const;
export type Justify = (typeof Justify)[keyof typeof Justify];

const viaAlignByJustify = {
  [Justify.Start]: "start",
  [Justify.Middle]: "center",
  [Justify.End]: "end",
} as const;

type PopconfirmProps = {
  align?: Align;
  children: React.ReactNode;
  className?: string;
  confirmDisabled?: boolean;
  confirmText?: string;
  "data-testid"?: string;
  justify?: Justify;
  onClose?: () => void;
  onConfirm?: () => void;
  open?: boolean;
  refEl?: React.RefObject<HTMLElement | null>;
  setOpen?: (open: boolean) => void;
  trigger?: React.ReactNode;
};

const Popconfirm: React.FC<PopconfirmProps> = ({
  align = Align.Top,
  children,
  className,
  confirmDisabled = false,
  confirmText = "Yes",
  "data-testid": dataTestId,
  justify = Justify.Middle,
  onClose = () => {},
  onConfirm = () => {},
  open: controlledOpen,
  refEl,
  setOpen: controlledSetOpen,
  trigger,
}) => {
  const isControlled = !!(controlledOpen !== undefined && controlledSetOpen);
  const [uncontrolledOpen, uncontrolledSetOpen] = useState(false);
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const setOpen = isControlled ? controlledSetOpen : uncontrolledSetOpen;

  const triggerRef = useRef<HTMLSpanElement>(null);
  const anchorRef = refEl ?? triggerRef;

  const close = useCallback(() => {
    onClose();
    setOpen(false);
  }, [onClose, setOpen]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setOpen(true);
    } else {
      close();
    }
  };

  const isOutsideAnchor = (element: Element) =>
    !anchorRef.current?.contains(element);

  return (
    <PopoverRoot
      align={viaAlignByJustify[justify]}
      isDismissable
      isNonModal
      isOpen={open}
      onOpenChange={handleOpenChange}
      referenceElement={anchorRef}
      shouldCloseOnInteractOutside={isOutsideAnchor}
      shouldToggleOnPress={false}
      side={align}
      triggerType="dialog"
    >
      {trigger && (
        <span
          ref={triggerRef}
          className={styles.trigger}
          onClickCapture={() => handleOpenChange(!open)}
          role="presentation"
        >
          {trigger}
        </span>
      )}
      <Popover>
        <LeafyGreenProvider darkMode>
          <PopoverContainer
            className={cx(styles.contentWrapper, className)}
            data-testid={dataTestId}
          >
            {children}
            <div className={styles.buttonWrapper}>
              <Button
                data-testid="popconfirm-cancel-button"
                onPress={close}
                size="small"
              >
                Cancel
              </Button>
              <Button
                data-testid="popconfirm-confirm-button"
                isDisabled={confirmDisabled}
                onPress={() => {
                  onConfirm();
                  setOpen(false);
                }}
                size="small"
                variant="primary"
              >
                {confirmText}
              </Button>
            </div>
          </PopoverContainer>
        </LeafyGreenProvider>
      </Popover>
    </PopoverRoot>
  );
};

export default Popconfirm;
