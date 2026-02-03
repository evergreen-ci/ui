import styled from "@emotion/styled";
import { Skeleton, TableSkeleton } from "@leafygreen-ui/skeleton-loader";
import { size } from "@evg-ui/lib/constants";

const SpawnPageSkeleton = () => (
  <div>
    <HeaderSkeleton />
    <ButtonSkeleton />
    <StyledTableSkeleton />
  </div>
);
export default SpawnPageSkeleton;

const StyledTableSkeleton = styled(TableSkeleton)`
  margin-top: 20px;
`;
const HeaderSkeleton = styled(Skeleton)`
  width: 400px;
`;
const ButtonSkeleton = styled(Skeleton)`
  margin-top: ${size.l};
  width: 200px;
`;
