import { Toggle, ToggleProps, Size as ToggleSize } from "@leafygreen-ui/toggle";
import { Description, Label } from "@leafygreen-ui/typography";
import styles from "./index.module.css";

interface Props {
  checked: boolean;
  description?: string;
  disabled?: boolean;
  id: string;
  label: string;
  onChange: ToggleProps["onChange"];
}

export const ToggleWithLabel: React.FC<Props> = ({
  checked,
  description,
  disabled,
  id,
  label,
  onChange,
}) => (
  <div className={styles.toggleContainer}>
    <Toggle
      aria-labelledby={`${id}-label`}
      checked={checked}
      disabled={disabled}
      id={id}
      onChange={onChange}
      size={ToggleSize.Small}
    />
    <div>
      <Label htmlFor={id} id={`${id}-label`}>
        {label}
      </Label>
      <Description>{description}</Description>
    </div>
  </div>
);
