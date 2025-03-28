import styled from "@emotion/styled";
import { ListSkeleton } from "@leafygreen-ui/skeleton-loader";
import { LoadingCell, LabelCellContainer } from "components/HistoryTable/Cell";

interface LoadingRowProps {
  numVisibleCols: number;
}
const LoadingRow: React.FC<LoadingRowProps> = ({ numVisibleCols }) => (
  <Container>
    <LabelCellContainer>
      <ListSkeleton />
    </LabelCellContainer>
    {Array.from(Array(numVisibleCols)).map((_, index) => (
      // Disabling key index rules since there is nothing unique about these rows
      <LoadingCell key={`loading_row_${index}`} /> // eslint-disable-line react/no-array-index-key
    ))}
  </Container>
);

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export default LoadingRow;
