import { Checkbox } from "@via-ds/components/checkbox";
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
        className={styles.styledCheckbox}
        data-testid={title}
        isSelected={value.includes(checkboxValue)}
        onChange={(isSelected: boolean) =>
          // Create a synthetic change event to maintain the same interface
          onChange(
            {
              target: { checked: isSelected },
            } as React.ChangeEvent<HTMLInputElement>,
            key,
          )
        }
      >
        {title}
      </Checkbox>
    ))}
  </div>
);
