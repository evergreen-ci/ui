import { ObjectFieldTemplateProps } from "@rjsf/core";
import { getFields } from "components/SpruceForm/utils";
import styles from "./RegexSelectorRow.module.css";

export const RegexSelectorRow: React.FC<
  Pick<ObjectFieldTemplateProps, "formData" | "properties" | "uiSchema">
> = ({ formData, properties }) => {
  const [regexSelect, regexInput] = getFields(properties, formData.isDisabled);

  return (
    <div className={styles.rowContainer} data-testid="regex-selector-row">
      <div className={styles.leftColumn}>{regexSelect}</div>
      <div className={styles.middleText}>matches</div>
      <div className={styles.rightColumn}>{regexInput}</div>
    </div>
  );
};
