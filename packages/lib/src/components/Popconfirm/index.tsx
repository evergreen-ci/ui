import { cloneElement, useContext, useRef } from "react";
import {
  Align,
  Button,
  Popover,
  PopoverContext,
  PopoverFrameWithArrow,
  PopoverRoot,
  PopoverRootProps,
  Side,
} from "@via-ds/components";
import { cx } from "../../utils/css";
import styles from "./index.module.css";

type PopconfirmProps = Pick<PopoverRootProps, "align" | "side"> & {
  children: React.ReactNode;
  className?: string;
  confirmDisabled?: boolean;
  confirmText?: string;
  "data-testid"?: string;
  onClose?: () => void;
  onConfirm?: () => void;
  open?: boolean;
  refEl?: React.RefObject<HTMLElement | null>;
  setOpen?: (open: boolean) => void;
  trigger?: React.ReactElement<{
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  }>;
};

// Clones the trigger instead of wrapping it so the popover can anchor to the
// element itself. Toggling on the trigger's own click still runs when the
// trigger stops propagation of the event, and recording the clicked element
// avoids taking over a ref the consumer may have set on the trigger.
const PopconfirmTrigger: React.FC<{
  onAnchor: (element: HTMLElement) => void;
  trigger: NonNullable<PopconfirmProps["trigger"]>;
}> = ({ onAnchor, trigger }) => {
  const state = useContext(PopoverContext)?.state;

  return cloneElement(trigger, {
    onClick: (e: React.MouseEvent<HTMLElement>) => {
      onAnchor(e.currentTarget);
      trigger.props.onClick?.(e);
      state?.toggle();
    },
  });
};

const PopconfirmActions: React.FC<
  Pick<PopconfirmProps, "confirmDisabled" | "confirmText" | "onConfirm">
> = ({ confirmDisabled, confirmText, onConfirm }) => {
  const state = useContext(PopoverContext)?.state;

  return (
    <div className={styles.buttonWrapper}>
      <Button
        data-testid="popconfirm-cancel-button"
        onPress={() => state?.close()}
        size="small"
      >
        Cancel
      </Button>
      <Button
        data-testid="popconfirm-confirm-button"
        isDisabled={confirmDisabled}
        onPress={() => {
          onConfirm?.();
          state?.close();
        }}
        size="small"
        variant="primary"
      >
        {confirmText}
      </Button>
    </div>
  );
};

const Popconfirm: React.FC<PopconfirmProps> = ({
  align = Align.Center,
  children,
  className,
  confirmDisabled = false,
  confirmText = "Yes",
  "data-testid": dataTestId,
  onClose = () => {},
  onConfirm = () => {},
  open,
  refEl,
  setOpen,
  side = Side.Top,
  trigger,
}) => {
  const isControlled = open !== undefined && !!setOpen;
  const triggerRef = useRef<HTMLElement | null>(null);
  const arrowRef = useRef<SVGSVGElement | null>(null);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      onClose();
    }
    if (isControlled) {
      setOpen(nextOpen);
    }
  };

  return (
    <PopoverRoot
      align={align}
      arrowRef={arrowRef}
      isDismissable
      isNonModal
      isOpen={isControlled ? open : undefined}
      onOpenChange={handleOpenChange}
      referenceElement={refEl ?? triggerRef}
      shouldToggleOnPress={false}
      side={side}
      triggerType="dialog"
    >
      {trigger && (
        <PopconfirmTrigger
          onAnchor={(element) => {
            triggerRef.current = element;
          }}
          trigger={trigger}
        />
      )}
      <Popover>
        <PopoverFrameWithArrow className={cx(styles.frame, className)}>
          <div
            className={styles.contentWrapper}
            data-testid={dataTestId}
            onClick={(e) => e.stopPropagation()}
            role="presentation"
          >
            {children}
            <PopconfirmActions
              confirmDisabled={confirmDisabled}
              confirmText={confirmText}
              onConfirm={onConfirm}
            />
          </div>
        </PopoverFrameWithArrow>
      </Popover>
    </PopoverRoot>
  );
};

export default Popconfirm;
