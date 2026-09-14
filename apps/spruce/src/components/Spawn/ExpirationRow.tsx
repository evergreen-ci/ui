import { SpruceFormProps } from "components/SpruceForm/types";
import styles from "./ExpirationRow.module.css";

export const ExpirationRow: SpruceFormProps["ObjectFieldTemplate"] = ({
  properties,
}) => {
  const [expiration, noExpiration] = properties;

  return (
    <div className={styles.expirationContainer}>
      <div>{expiration.content}</div>
      <div>or</div>
      <div>{noExpiration.content}</div>
    </div>
  );
};
