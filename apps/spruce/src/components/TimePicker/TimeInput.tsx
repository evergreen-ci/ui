import styles from "./TimeInput.module.css";

interface TimeInputProps {
  "data-testid": string;
  value: string;
  disabled: boolean;
  setPopoverOpen: (val: boolean) => void;
}

const TimeInput: React.FC<TimeInputProps> = ({
  "data-testid": dataTestId,
  disabled,
  setPopoverOpen,
  value,
}) => (
  <input
    className={styles.input}
    data-testid={dataTestId}
    disabled={disabled}
    maxLength={2}
    onClick={() => setPopoverOpen(true)}
    placeholder="00"
    type="text"
    value={value}
  />
);
TimeInput.displayName = "TimeInput";

export default TimeInput;
