import { Badge, BadgeVariant } from "@via-ds/components/badge";
import { Disclaimer } from "@via-ds/components/typography";
import pluralize from "pluralize";
import { Link } from "react-router-dom";
import { getTaskQueueRoute } from "constants/routes";
import { TaskQueueDistro } from "gql/generated/types";
import styles from "./DistroOption.module.css";

interface DistroOptionProps {
  option: TaskQueueDistro;
  onClick: (val: TaskQueueDistro) => void;
}

export const DistroOption: React.FC<DistroOptionProps> = ({
  onClick,
  option,
}) => {
  const { hostCount, id, taskCount } = option;
  return (
    <Link onClick={() => onClick(option)} to={getTaskQueueRoute(id)}>
      <div className={styles.optionWrapper}>
        <Badge className={styles.badge} variant={BadgeVariant.Status}>
          {pluralize("task", taskCount, true)}
        </Badge>
        <Badge className={styles.badge} variant={BadgeVariant.Status}>
          {pluralize("host", hostCount, true)}
        </Badge>
        <Disclaimer className={styles.distroName}>{id}</Disclaimer>
      </div>
    </Link>
  );
};
