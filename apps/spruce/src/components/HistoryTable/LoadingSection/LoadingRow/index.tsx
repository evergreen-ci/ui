import { Skeleton, SkeletonWrapper } from "@via-ds/components/skeleton";
import { LabelCellContainer, LoadingCell } from "components/HistoryTable/Cell";
import styles from "./index.module.css";

interface LoadingRowProps {
  numVisibleCols: number;
}
const LoadingRow: React.FC<LoadingRowProps> = ({ numVisibleCols }) => (
  <div className={styles.container}>
    <LabelCellContainer>
      <Skeleton isLoading>
        <SkeletonWrapper>
          <div className={styles.listSkeletonLine} />
        </SkeletonWrapper>
        <SkeletonWrapper>
          <div className={styles.listSkeletonLine} />
        </SkeletonWrapper>
        <SkeletonWrapper>
          <div className={styles.listSkeletonLine} />
        </SkeletonWrapper>
      </Skeleton>
    </LabelCellContainer>
    {Array.from(Array(numVisibleCols)).map((_, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <LoadingCell key={`loading_row_${index}`} />
    ))}
  </div>
);

export default LoadingRow;
