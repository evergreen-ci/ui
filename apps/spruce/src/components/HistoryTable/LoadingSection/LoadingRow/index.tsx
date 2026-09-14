import { ListSkeleton } from "@leafygreen-ui/skeleton-loader";
import { LabelCellContainer, LoadingCell } from "components/HistoryTable/Cell";
import styles from "./index.module.css";

interface LoadingRowProps {
  numVisibleCols: number;
}
const LoadingRow: React.FC<LoadingRowProps> = ({ numVisibleCols }) => (
  <div className={styles.container}>
    <LabelCellContainer>
      <ListSkeleton />
    </LabelCellContainer>
    {Array.from(Array(numVisibleCols)).map((_, index) => (
      // Disabling key index rules since there is nothing unique about these rows
      <LoadingCell key={`loading_row_${index}`} /> // eslint-disable-line react/no-array-index-key
    ))}
  </div>
);

export default LoadingRow;
