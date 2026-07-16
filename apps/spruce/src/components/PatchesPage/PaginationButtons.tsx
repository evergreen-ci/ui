import styled from "@emotion/styled";
import { Pagination } from "@evg-ui/lib/components/Pagination";
import { size } from "@evg-ui/lib/constants/tokens";
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
  const { sendEvent } =
    pageType === "project" ? projectPatchesAnalytics : userPatchesAnalytics;

  const { limit, page } = usePatchesQueryParams();

  return (
    <PaginationRow>
      <Pagination
        countLimit={PATCH_COUNT_LIMIT}
        currentPage={page}
        onPageChange={() => sendEvent({ name: "Changed page" })}
        onPageSizeChange={() => sendEvent({ name: "Changed page size" })}
        pageSize={limit}
        totalResults={filteredPatchCount}
      />
    </PaginationRow>
  );
};

const PaginationRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: ${size.s};
`;
