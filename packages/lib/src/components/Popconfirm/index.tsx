import { useCallback, useRef, useState } from "react";
import { Align, Button, Popover, PopoverRoot, Side } from "@via-ds/components";
import { cx } from "../../utils/css";
import styles from "./index.module.css";

type PopconfirmProps = {
  align?: Side;
  children: React.ReactNode;
  className?: string;
  confirmDisabled?: boolean;
  confirmText?: string;
  "data-testid"?: string;
  justify?: Align;
  onClose?: () => void;
  onConfirm?: () => void;
  open?: boolean;
  refEl?: React.RefObject<HTMLElement | null>;
  setOpen?: (open: boolean) => void;
  trigger?: React.ReactNode;
};

const Popconfirm: React.FC<PopconfirmProps> = ({
  align = Side.Top,
  children,
  className,
  confirmDisabled = false,
  confirmText = "Yes",
  "data-testid": dataTestId,
  justify = Align.Center,
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
      align={justify}
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
          onClick={() => (open ? close() : setOpen(true))}
          role="presentation"
        >
          {trigger}
        </span>
      )}
      <Popover>
        <div
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
        </div>
      </Popover>
    </PopoverRoot>
  );
};

export default Popconfirm;
