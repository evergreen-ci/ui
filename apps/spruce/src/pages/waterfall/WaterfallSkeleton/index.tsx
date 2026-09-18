import { Skeleton, Text } from "@via-ds/components";
import { VERSION_LIMIT } from "../constants";
import styles from "./index.module.css";

interface WaterfallSkeletonProps {
  enableAnimations?: boolean;
  numCols?: number;
  numRows?: number;
}

const WaterfallSkeleton: React.FC<WaterfallSkeletonProps> = ({
  enableAnimations = true,
  numCols = VERSION_LIMIT + 1,
  numRows = 15,
}) => (
  <Skeleton isLoading>
    <div
      aria-busy="true"
      aria-label="Loading waterfall data"
      className={styles.skeleton}
      data-animations-enabled={enableAnimations}
      data-testid="waterfall-skeleton"
      role="status"
      style={
        {
          "--waterfall-skeleton-columns": numCols,
        } as React.CSSProperties
      }
    >
      {Array.from({ length: numCols * (numRows + 1) }, (_, index) => (
        <Text key={index} className={styles.cell}>
          Loading waterfall data
        </Text>
      ))}
    </div>
  </Skeleton>
);

export default WaterfallSkeleton;
