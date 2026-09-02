import { Badge, Variant } from "@leafygreen-ui/badge";
import styles from "./TabLabelWithBadge.module.css";

interface Props {
  tabLabel: string;
  badgeText: string | number;
  badgeVariant: Variant;
  dataTestIdBadge?: string;
}
export const TabLabelWithBadge: React.FC<Props> = ({
  badgeText,
  badgeVariant,
  dataTestIdBadge,
  tabLabel,
}) => (
  <>
    {tabLabel}{" "}
    <Badge
      className={styles.badge}
      data-testid={dataTestIdBadge}
      variant={badgeVariant}
    >
      {badgeText}
    </Badge>
  </>
);
