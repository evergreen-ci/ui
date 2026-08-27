import { useRef, useState } from "react";
import {
  Button,
  Size as ButtonSize,
  Variant as ButtonVariant,
} from "@leafygreen-ui/button";
import { Popover } from "@leafygreen-ui/popover";
import { Tooltip, TriggerEvent } from "@leafygreen-ui/tooltip";
import { useOnClickOutside } from "@evg-ui/lib/hooks";
import { PopoverContainer } from "components/styles/Popover";
import styles from "./HostPopover.module.css";

interface Props {
  buttonText: string;
  titleText: string;
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
  "data-testid"?: string;
  showTooltip: boolean;
  tooltipMessage: string;
}

export const HostPopover: React.FC<Props> = ({
  buttonText,
  "data-testid": dataTestId,
  disabled = false,
  loading,
  onClick,
  showTooltip,
  titleText,
  tooltipMessage,
}) => {
  const [active, setActive] = useState(false);
  const buttonRef = useRef(null);
  const popoverRef = useRef(null);

  // Handle onClickOutside
  useOnClickOutside([buttonRef, popoverRef], () => setActive(false));

  return showTooltip ? (
    <Tooltip
      trigger={
        <Button data-testid={dataTestId} disabled>
          {buttonText}
        </Button>
      }
      triggerEvent={TriggerEvent.Hover}
    >
      {tooltipMessage}
    </Tooltip>
  ) : (
    <>
      <div ref={buttonRef} className={styles.buttonWrapper}>
        <Button
          data-testid={dataTestId}
          disabled={disabled}
          onClick={() => setActive((curr) => !curr)}
        >
          {buttonText}
        </Button>
      </div>
      <Popover
        active={active}
        align="bottom"
        data-testid={`${dataTestId}-popover`}
      >
        <PopoverContainer ref={popoverRef}>
          {titleText}

          <div className={styles.buttonContainer}>
            <div className={styles.buttonSpacer}>
              <Button
                disabled={loading}
                onClick={() => setActive(false)}
                size={ButtonSize.XSmall}
              >
                No
              </Button>
            </div>
            <div className={styles.buttonSpacer}>
              <Button
                disabled={loading}
                onClick={() => {
                  onClick();
                  setActive(false);
                }}
                size={ButtonSize.XSmall}
                variant={ButtonVariant.Primary}
              >
                Yes
              </Button>
            </div>
          </div>
        </PopoverContainer>
      </Popover>
    </>
  );
};
