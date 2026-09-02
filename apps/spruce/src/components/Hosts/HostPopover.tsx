import { useState } from "react";
import {
  Button,
  Popover,
  PopoverRoot,
  Tooltip,
  TooltipRoot,
  TooltipTrigger,
} from "@via-ds/components";
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

  return showTooltip ? (
    <TooltipRoot>
      <TooltipTrigger>
        {/* Disabled buttons suppress pointer events, so the hover handlers
            live on the wrapper span and the button is pointer-events: none
            for the tooltip to show. */}
        <span className={styles.tooltipTrigger}>
          <Button data-testid={dataTestId} isDisabled>
            {buttonText}
          </Button>
        </span>
      </TooltipTrigger>
      <Tooltip>{tooltipMessage}</Tooltip>
    </TooltipRoot>
  ) : (
    <PopoverRoot isOpen={active} onOpenChange={setActive} triggerType="dialog">
      <div className={styles.buttonWrapper}>
        <Button data-testid={dataTestId} isDisabled={disabled}>
          {buttonText}
        </Button>
      </div>
      <Popover>
        {/* Via's Popover stamps its own data-testid, so the identifying
            testid lives on the content container instead. */}
        <PopoverContainer data-testid={`${dataTestId}-popover`}>
          {titleText}

          <div className={styles.buttonContainer}>
            <div className={styles.buttonSpacer}>
              <Button
                isDisabled={loading}
                onPress={() => setActive(false)}
                size="small"
              >
                No
              </Button>
            </div>
            <div className={styles.buttonSpacer}>
              <Button
                isDisabled={loading}
                onPress={() => {
                  onClick();
                  setActive(false);
                }}
                size="small"
                variant="primary"
              >
                Yes
              </Button>
            </div>
          </div>
        </PopoverContainer>
      </Popover>
    </PopoverRoot>
  );
};
