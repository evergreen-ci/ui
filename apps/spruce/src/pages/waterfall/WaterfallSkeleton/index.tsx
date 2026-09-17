import { Skeleton, Text } from "@via-ds/components";
import { VERSION_LIMIT } from "../constants";
import styles from "./index.module.css";

interface WaterfallSkeletonProps {
  numCols?: number;
  numRows?: number;
}

const WaterfallSkeleton: React.FC<WaterfallSkeletonProps> = ({
  numCols = VERSION_LIMIT + 1,
  numRows = 15,
}) => (
  <Skeleton isLoading>
    <div
      className={styles.skeleton}
      data-testid="waterfall-skeleton"
      style={
        {
          "--waterfall-skeleton-columns": numCols,
        } as React.CSSProperties
      }
    >
      {Array.from({ length: numCols * numRows }, (_, index) => (
        <Text key={index}>Loading waterfall data</Text>
      ))}
    </div>
  </Skeleton>
);

export default WaterfallSkeleton;
