import { useState, useRef } from "react";
import styled from "@emotion/styled";
import Button, {
  Size as ButtonSize,
  Variant as ButtonVariant,
} from "@leafygreen-ui/button";
import { Popover } from "@leafygreen-ui/popover";
import { Tooltip, TriggerEvent } from "@leafygreen-ui/tooltip";
import { size } from "@evg-ui/lib/constants/tokens";
import { useOnClickOutside } from "@evg-ui/lib/hooks";
import { PopoverContainer } from "components/styles/Popover";

interface Props {
  buttonText: string;
  titleText: string;
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
  "data-cy"?: string;
  showTooltip: boolean;
  tooltipMessage: string;
}

export const HostPopover: React.FC<Props> = ({
  buttonText,
  "data-cy": dataCy,
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
        <Button data-cy={dataCy} disabled>
          {buttonText}
        </Button>
      }
      triggerEvent={TriggerEvent.Hover}
    >
      {tooltipMessage}
    </Tooltip>
  ) : (
    <>
      <ButtonWrapper ref={buttonRef}>
        <Button
          data-cy={dataCy}
          disabled={disabled}
          onClick={() => setActive((curr) => !curr)}
        >
          {buttonText}
        </Button>
      </ButtonWrapper>
      <Popover active={active} align="bottom" data-cy={`${dataCy}-popover`}>
        <PopoverContainer ref={popoverRef}>
          {titleText}

          <ButtonContainer>
            <ButtonSpacer>
              <Button
                disabled={loading}
                onClick={() => setActive(false)}
                size={ButtonSize.XSmall}
              >
                No
              </Button>
            </ButtonSpacer>
            <ButtonSpacer>
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
            </ButtonSpacer>
          </ButtonContainer>
        </PopoverContainer>
      </Popover>
    </>
  );
};

const ButtonWrapper = styled.div`
  white-space: nowrap; // prevent button collapse when screen is small
`;
const ButtonContainer = styled.div`
  margin-top: ${size.xs};
  display: flex;
  justify-content: flex-end;
`;
const ButtonSpacer = styled.div`
  margin-left: ${size.xs};
`;
