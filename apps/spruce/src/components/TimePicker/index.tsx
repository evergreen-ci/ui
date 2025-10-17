import { useRef, useState } from "react";
import styled from "@emotion/styled";
import { DateType } from "@leafygreen-ui/date-utils";
import { FormField, FormFieldInputContainer } from "@leafygreen-ui/form-field";
import IconButton from "@leafygreen-ui/icon-button";
import { palette } from "@leafygreen-ui/palette";
import Popover, { Align, Justify } from "@leafygreen-ui/popover";
import Icon from "@evg-ui/lib/components/Icon";
import { size } from "@evg-ui/lib/constants/tokens";
import { useOnClickOutside } from "@evg-ui/lib/hooks/useOnClickOutside";
import { PopoverContainer } from "components/styles/Popover";
import { hourOptions, minuteOptions } from "./constants";
import TimeInput from "./TimeInput";
import TimePickerOptions from "./TimeOptions";
import { TimepickerType } from "./types";

const { gray } = palette;

interface TimePickerProps {
  "data-cy"?: string;
  disabled: boolean;
  label?: string;
  onDateChange: (newDate: DateType) => void;
  value: Date;
}

const TimePicker: React.FC<TimePickerProps> = ({
  "data-cy": dataCy,
  disabled = false,
  label = "",
  onDateChange,
  value,
}) => {
  const hourValue = value.getHours().toString().padStart(2, "0");
  const minuteValue = value.getMinutes().toString().padStart(2, "0");

  const formRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  useOnClickOutside([formRef, popoverRef], () => setPopoverOpen(false));

  return (
    <>
      <FormField
        ref={formRef}
        aria-label="Time picker form"
        data-cy={dataCy}
        disabled={disabled}
        label={label}
      >
        <FormFieldInputContainer
          contentEnd={
            <IconButton
              aria-label="Clock Icon"
              onClick={() => {
                setPopoverOpen(!popoverOpen);
              }}
            >
              <Icon glyph="Clock" />
            </IconButton>
          }
          role="combobox"
          tabIndex={-1}
        >
          <ContentWrapper>
            <TimeInput
              data-cy="hour-input"
              disabled={disabled}
              setPopoverOpen={setPopoverOpen}
              value={hourValue}
            />
            <Colon>:</Colon>
            <TimeInput
              data-cy="minute-input"
              disabled={disabled}
              setPopoverOpen={setPopoverOpen}
              value={minuteValue}
            />
          </ContentWrapper>
        </FormFieldInputContainer>
      </FormField>
      <Popover
        active={popoverOpen}
        align={Align.Bottom}
        justify={Justify.Start}
        refEl={formRef}
        spacing={0}
      >
        <MenuList ref={popoverRef} data-cy="time-picker-options">
          <TimePickerOptions
            currentDateTime={value}
            data-cy="hour-options"
            onDateChange={onDateChange}
            options={hourOptions}
            type={TimepickerType.Hour}
            value={hourValue}
          />
          <VerticalLine />
          <TimePickerOptions
            currentDateTime={value}
            data-cy="minute-options"
            onDateChange={onDateChange}
            options={minuteOptions}
            type={TimepickerType.Minute}
            value={minuteValue}
          />
        </MenuList>
      </Popover>
    </>
  );
};

const VerticalLine = styled.div`
  border-left: 1px solid ${gray.light2};
`;

const Colon = styled.span`
  font-family: inherit;
`;

const MenuList = styled(PopoverContainer)`
  display: flex;
  flex-direction: row;

  height: 230px;
  padding: 0;
  padding-top: ${size.xs};
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export default TimePicker;
