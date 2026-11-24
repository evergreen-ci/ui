import { LabeledValue } from "@via-ds/components/labeled-value";
import { Body, Label } from "@via-ds/components/typography";
import { MyHost, TableVolume } from "types/spawn";
import styles from "./DetailsCard.module.css";

type FieldMap<T> = {
  [key: string]: (T: T) => React.JSX.Element;
};

interface DetailsCardProps {
  type: MyHost | TableVolume;
  ["data-testid"]?: string;
  fieldMaps: FieldMap<MyHost | TableVolume>;
}

export const DetailsCard: React.FC<DetailsCardProps> = ({
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
