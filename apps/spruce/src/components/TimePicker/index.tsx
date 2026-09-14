import { useRef, useState } from "react";
import { DateType } from "@leafygreen-ui/date-utils";
import { FormField, FormFieldInputContainer } from "@leafygreen-ui/form-field";
import { IconButton } from "@leafygreen-ui/icon-button";
import { Align, Justify, Popover } from "@leafygreen-ui/popover";
import Icon from "@evg-ui/lib/components/Icon";
import { useOnClickOutside } from "@evg-ui/lib/hooks/useOnClickOutside";
import { PopoverContainer } from "components/styles/Popover";
import { hourOptions, minuteOptions } from "./constants";
import styles from "./index.module.css";
import TimeInput from "./TimeInput";
import TimePickerOptions from "./TimeOptions";
import { TimepickerType } from "./types";

interface TimePickerProps {
  "data-testid"?: string;
  disabled: boolean;
  label?: string;
  onDateChange: (newDate: DateType) => void;
  value: Date;
}

const TimePicker: React.FC<TimePickerProps> = ({
  "data-testid": dataTestId,
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
        data-testid={dataTestId}
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
          <div className={styles.contentWrapper}>
            <TimeInput
              data-testid="hour-input"
              disabled={disabled}
              setPopoverOpen={setPopoverOpen}
              value={hourValue}
            />
            <span className={styles.colon}>:</span>
            <TimeInput
              data-testid="minute-input"
              disabled={disabled}
              setPopoverOpen={setPopoverOpen}
              value={minuteValue}
            />
          </div>
        </FormFieldInputContainer>
      </FormField>
      <Popover
        active={popoverOpen}
        align={Align.Bottom}
        justify={Justify.Start}
        refEl={formRef}
        spacing={0}
      >
        <PopoverContainer
          ref={popoverRef}
          className={styles.menuList}
          data-testid="time-picker-options"
        >
          <TimePickerOptions
            currentDateTime={value}
            data-testid="hour-options"
            onDateChange={onDateChange}
            options={hourOptions}
            type={TimepickerType.Hour}
            value={hourValue}
          />
          <div className={styles.verticalLine} />
          <TimePickerOptions
            currentDateTime={value}
            data-testid="minute-options"
            onDateChange={onDateChange}
            options={minuteOptions}
            type={TimepickerType.Minute}
            value={minuteValue}
          />
        </PopoverContainer>
      </Popover>
    </>
  );
};

export default TimePicker;
