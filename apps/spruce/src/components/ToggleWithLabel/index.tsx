import { Switch } from "@via-ds/components/switch";
import { Description, Label } from "@via-ds/components/typography";
import styles from "./index.module.css";

interface Props {
  checked: boolean;
  description?: string;
  disabled?: boolean;
  id: string;
  label: string;
  onChange: (isSelected: boolean) => void;
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
    <Switch
      aria-labelledby={`${id}-label`}
      id={id}
      isDisabled={disabled}
      isSelected={checked}
      onChange={onChange}
      size="small"
    />
    <div>
      <Label htmlFor={id} id={`${id}-label`}>
        {label}
      </Label>
      <Description>{description}</Description>
    </div>
  </div>
);
