import { LabeledValue } from "@via-ds/components/labeled-value";
import { Body, Label } from "@via-ds/components/typography";
import { MyHost, TableVolume } from "types/spawn";
import styles from "./DetailsFields.module.css";

type FieldMap<T> = {
  [key: string]: (T: T) => React.JSX.Element;
};

interface DetailsFieldsProps {
  type: MyHost | TableVolume;
  ["data-testid"]?: string;
  fieldMaps: FieldMap<MyHost | TableVolume>;
}

export const DetailsFields: React.FC<DetailsFieldsProps> = ({
  "data-testid": dataTestId,
  fieldMaps,
  type,
}) => (
  <div className={styles.fields} data-testid={dataTestId}>
    {Object.entries(fieldMaps).map(([label, getValue]) => {
      const value = getValue(type);
      return value === undefined ? null : (
        <LabeledValue key={label}>
          <Label>{label}</Label>
          <Body className={styles.value} elementType="div">
            {value}
          </Body>
        </LabeledValue>
      );
    })}
  </div>
);
