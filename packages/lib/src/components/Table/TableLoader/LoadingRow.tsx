import { Skeleton } from "@leafygreen-ui/skeleton-loader";
import styles from "./LoadingRow.module.css";

interface LoadingRowProps {
  numColumns: number;
}
const LoadingRow: React.FC<LoadingRowProps> = ({ numColumns }) => (
  <tr data-testid="table-loader-loading-row">
    {Array.from({ length: numColumns }, (_, i) => (
      <td key={i} className={styles.loadingCell}>
        <Skeleton size="small" />
      </td>
    ))}
  </tr>
);

export default LoadingRow;
