import { Subtitle } from "@leafygreen-ui/typography";
import { useDateFormat } from "hooks";
import styles from "./Header.module.css";

interface Props {
  timestamp: Date;
  user: string;
  section?: string | null;
}

export const Header: React.FC<Props> = ({ section, timestamp, user }) => {
  const getDateCopy = useDateFormat();

  return (
    <div className={styles.header}>
      <Subtitle>{getDateCopy(timestamp)}</Subtitle>
      <div className={styles.userSection}>
        <div>{user}</div>
        {section && (
          <span className={styles.sectionLabel}>Section: {section}</span>
        )}
      </div>
    </div>
  );
};
