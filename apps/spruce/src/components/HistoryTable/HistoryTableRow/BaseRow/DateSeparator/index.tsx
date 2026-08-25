import { Body } from "@leafygreen-ui/typography";
import { useDateFormat } from "hooks";
import { DashedLine } from "../styles";
import styles from "./index.module.css";

interface DateSeparatorProps {
  date: Date;
}

const DateSeparator: React.FC<DateSeparatorProps> = ({ date }) => {
  const getDateCopy = useDateFormat();
  return (
    <div className={styles.container}>
      <Body className={styles.dateWrapper}>
        {getDateCopy(date, { dateOnly: true })}
      </Body>
      <DashedLine />
    </div>
  );
};

export default DateSeparator;
