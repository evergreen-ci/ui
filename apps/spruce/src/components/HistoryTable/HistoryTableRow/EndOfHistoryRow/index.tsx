import { Body } from "@leafygreen-ui/typography";
import { DashedLine } from "../BaseRow/styles";
import styles from "./index.module.css";

interface EndOfHistoryRowProps {
  children: string;
}
const EndOfHistoryRow: React.FC<EndOfHistoryRowProps> = ({ children }) => (
  <div className={styles.row}>
    <DashedLine />
    <Body className={styles.styledBody} weight="medium">
      {children}
    </Body>
    <DashedLine />
  </div>
);

export default EndOfHistoryRow;
