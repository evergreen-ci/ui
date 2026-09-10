import { useRef, useState } from "react";

import { Button } from "@via-ds/components/button";
import { Popover, PopoverRoot } from "@via-ds/components/popover";
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
  onDateChange: (newDate: Date) => void;
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
    <div
      ref={formRef}
      aria-label={label || "Time picker form"}
      data-testid={dataTestId}
    >
      {label && <label>{label}</label>}
      <PopoverRoot
        isNonModal
        isOpen={popoverOpen}
        onOpenChange={setPopoverOpen}
        triggerType="dialog"
      >
        <div style={{ display: "flex", alignItems: "center" }}>
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
          <Button
            aria-label="Clock Icon"
            onPress={() => setPopoverOpen(!popoverOpen)}
            variant="tertiary"
          >
            <Icon glyph="Clock" />
          </Button>
        </div>
        <Popover ref={popoverRef}>
          <PopoverContainer
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
      </PopoverRoot>
    </div>
  );
};

export default TimePicker;
