import { Badge, BadgeVariant } from "@via-ds/components/badge";
import styles from "./TabLabelWithBadge.module.css";

interface Props {
  tabLabel: string;
  badgeText: string | number;
  badgeVariant: BadgeVariant;
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
