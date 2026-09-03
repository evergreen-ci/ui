import { Checkbox } from "@via-ds/components";
import styles from "./OmitInactiveBuilds.module.css";

interface OmitInactiveBuildsProps {
  omitInactiveBuilds: boolean;
}

export const OmitInactiveBuilds: React.FC<OmitInactiveBuildsProps> = ({
  omitInactiveBuilds,
}) => (
  <Checkbox
    data-testid="omit-inactive-builds-checkbox"
    isReadOnly
    isSelected={omitInactiveBuilds}
  >
    <span className={styles.label}>
      <span>Omit inactive builds</span>
      <span className={styles.description}>
        When filtering, omit build variants with 0 activated tasks.
      </span>
    </span>
  </Checkbox>
);
