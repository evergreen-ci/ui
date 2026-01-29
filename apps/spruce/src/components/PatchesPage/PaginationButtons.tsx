import styled from "@emotion/styled";
import PageSizeSelector from "@evg-ui/lib/components/PageSizeSelector";
import Pagination from "@evg-ui/lib/components/Pagination";
import { size } from "@evg-ui/lib/constants/tokens";
import usePagination from "@evg-ui/lib/src/hooks/usePagination";
import { useProjectPatchesAnalytics, useUserPatchesAnalytics } from "analytics";
import { usePatchesQueryParams } from "./usePatchesQueryParams";

// For performance reasons, we stop counting the number of patches at 10000
const PATCH_COUNT_LIMIT = 10000;

interface PaginationButtonsProps {
  pageType: "project" | "user";
  filteredPatchCount?: number;
}

export const PaginationButtons: React.FC<PaginationButtonsProps> = ({
  filteredPatchCount = 0,
  pageType,
}) => {
  const userPatchesAnalytics = useUserPatchesAnalytics();
  const projectPatchesAnalytics = useProjectPatchesAnalytics();
  const analytics =
    pageType === "project" ? projectPatchesAnalytics : userPatchesAnalytics;

  const { setLimit } = usePagination();
  const { limit, page } = usePatchesQueryParams();
  const handlePageSizeChange = (pageSize: number): void => {
    setLimit(pageSize);
    analytics.sendEvent({ name: "Changed page size" });
  };

  return (
    <PaginationRow>
      <Pagination
        countLimit={PATCH_COUNT_LIMIT}
        currentPage={page}
        pageSize={limit}
        totalResults={filteredPatchCount}
      />
      <PageSizeSelector
        data-cy="my-patches-page-size-selector"
        onChange={handlePageSizeChange}
        value={limit}
      />
    </PaginationRow>
  );
};

const PaginationRow = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: ${size.s};
`;
