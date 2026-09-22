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
}) => {
  const cells = Array.from({ length: numRows + 1 }, (_row, rowIndex) =>
    Array.from({ length: numCols }, (_column, columnIndex) => {
      if (rowIndex === 0) {
        return {
          key: `${rowIndex}-${columnIndex}`,
          text:
            columnIndex === 0 ? "Build variant" : "Commit date and revision",
        };
      }
      return {
        key: `${rowIndex}-${columnIndex}`,
        text: columnIndex === 0 ? "Build variant name" : "Task status summary",
      };
    }),
  ).flat();

  return (
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
        {cells.map(({ key, text }) => (
          <Text key={key} aria-hidden="true" className={styles.cell}>
            {text}
          </Text>
        ))}
      </div>
    </Skeleton>
  );
};

export default WaterfallSkeleton;
