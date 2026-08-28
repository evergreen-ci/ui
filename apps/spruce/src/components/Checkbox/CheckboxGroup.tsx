import { Checkbox } from "@leafygreen-ui/checkbox";
import { TreeDataEntry } from "@evg-ui/lib/components/TreeSelect";
import styles from "./CheckboxGroup.module.css";

interface CheckboxesProps {
  data: TreeDataEntry[];
  value: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>, key: string) => void;
}

export const CheckboxGroup: React.FC<CheckboxesProps> = ({
  data,
  onChange = () => undefined,
  value,
}) => (
  <div className={styles.checkboxesWrapper}>
    {data.map(({ key, title, value: checkboxValue }) => (
      <Checkbox
        key={key}
        bold={false}
        checked={value.includes(checkboxValue)}
        className={styles.styledCheckbox}
        data-testid={title}
        label={title}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e, key)}
      />
    ))}
  </div>
);
