import { Text } from "@via-ds/components";
import Icon from "@evg-ui/lib/components/Icon";
import styles from "./OmitInactiveBuilds.module.css";

interface OmitInactiveBuildsProps {
  omitInactiveBuilds: boolean;
}

export const OmitInactiveBuilds: React.FC<OmitInactiveBuildsProps> = ({
  omitInactiveBuilds,
}) => (
  <>
    <span
      aria-hidden="true"
      className={styles.indicator}
      data-selected={omitInactiveBuilds}
      data-testid="omit-inactive-builds-indicator"
      slot="icon"
    >
      {omitInactiveBuilds && <Icon glyph="Checkmark" size="small" />}
    </span>
    <Text slot="label">Omit inactive builds</Text>
    <Text slot="description">
      When filtering, omit build variants with 0 activated tasks.
    </Text>
  </>
);
