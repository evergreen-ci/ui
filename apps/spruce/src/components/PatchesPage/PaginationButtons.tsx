import { useRef, useState } from "react";
import { Pagination } from "@via-ds/components";
import { PAGE_SIZES } from "@evg-ui/lib/constants/pagination";
import usePagination from "@evg-ui/lib/src/hooks/usePagination";
import { useProjectPatchesAnalytics, useUserPatchesAnalytics } from "analytics";
import styles from "./PaginationButtons.module.css";

// For performance reasons, we stop counting the number of patches at 10000
const PATCH_COUNT_LIMIT = 10000;

interface PaginationButtonsProps {
  filteredPatchCount?: number;
  loading?: boolean;
  pageType: "project" | "user";
}

export const PaginationButtons: React.FC<PaginationButtonsProps> = ({
  filteredPatchCount = 0,
  loading,
  pageType,
}) => {
  const userPatchesAnalytics = useUserPatchesAnalytics();
  const projectPatchesAnalytics = useProjectPatchesAnalytics();
  const { sendEvent } =
    pageType === "project" ? projectPatchesAnalytics : userPatchesAnalytics;

  const { limit, page, setLimit, setPage } = usePagination();
  const pageSizeResetPending = useRef(false);
  const [previousTotalResults, setPreviousTotalResults] =
    useState(filteredPatchCount);
  if (!loading && filteredPatchCount !== previousTotalResults) {
    setPreviousTotalResults(filteredPatchCount);
  }

  const totalItems =
    previousTotalResults >= PATCH_COUNT_LIMIT
      ? undefined
      : previousTotalResults;
  const isNextDisabled =
    totalItems === 0 ||
    (totalItems !== undefined && (page + 1) * limit >= totalItems);

  return (
    <div className={styles.paginationRow}>
      <Pagination
        className={styles.pagination}
        data-testid="pagination"
        isNextDisabled={isNextDisabled}
        isPreviousDisabled={page === 0}
        onPageChange={(newPage) => {
          if (pageSizeResetPending.current && newPage === 1) {
            pageSizeResetPending.current = false;
            return;
          }

          setPage(newPage - 1);
          sendEvent({
            name: "Changed page",
            "page.number": newPage - 1,
          });
        }}
        onPageSizeChange={(newPageSize) => {
          pageSizeResetPending.current = page > 0;
          setLimit(newPageSize);
          sendEvent({
            name: "Changed page size",
            "page.size": newPageSize,
          });
        }}
        page={page + 1}
        pageSize={limit}
        pageSizeOptions={PAGE_SIZES}
        showGoToPage={false}
        totalItems={totalItems}
      />
    </div>
  );
};
