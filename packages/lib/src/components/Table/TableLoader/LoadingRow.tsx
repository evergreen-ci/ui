import styled from "@emotion/styled";
import { Skeleton } from "@leafygreen-ui/skeleton-loader";
import { size } from "../../../constants/tokens";

interface LoadingRowProps {
  numColumns: number;
}
const LoadingRow: React.FC<LoadingRowProps> = ({ numColumns }) => (
  <tr data-cy="table-loader-loading-row">
    {Array.from({ length: numColumns }, (_, i) => (
      <LoadingCell key={i}>
        <Skeleton size="small" />
      </LoadingCell>
    ))}
  </tr>
);

const LoadingCell = styled.td`
  padding: ${size.xs} ${size.xs};
`;

export default LoadingRow;
