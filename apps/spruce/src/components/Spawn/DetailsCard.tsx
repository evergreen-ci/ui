import { Card } from "@leafygreen-ui/card";
import { MyHost, TableVolume } from "types/spawn";
import styles from "./DetailsCard.module.css";

interface CardItem {
  label: string;
  value: React.JSX.Element;
}

const CardField: React.FC<CardItem> = ({ label, value }) =>
  value !== undefined ? (
    <div className={styles.fieldContainer}>
      <div className={styles.fieldName}>{label}</div>
      <div>{value}</div>
    </div>
  ) : null;

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
  <Card className={styles.cardContainer} data-testid={dataTestId}>
    {Object.keys(fieldMaps).map((key) => (
      <CardField
        key={`${key}_${type.id}`}
        label={key}
        value={fieldMaps[key](type)}
      />
    ))}
  </Card>
);
