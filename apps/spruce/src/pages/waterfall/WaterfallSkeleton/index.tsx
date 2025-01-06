import {
  TableSkeleton,
  TableSkeletonProps,
} from "@leafygreen-ui/skeleton-loader";
import { VERSION_LIMIT } from "../constants";

const WaterfallSkeleton: React.FC<TableSkeletonProps> = ({
  numCols = VERSION_LIMIT + 1,
  numRows = 5,
  ...rest
}) => (
  <TableSkeleton
    data-cy="waterfall-skeleton"
    numCols={numCols}
    numRows={numRows}
    {...rest}
  />
);

export default WaterfallSkeleton;
