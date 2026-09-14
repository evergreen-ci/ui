import { Pagination } from "@evg-ui/lib/components/Pagination";
import { useProjectPatchesAnalytics, useUserPatchesAnalytics } from "analytics";
import styles from "./PaginationButtons.module.css";
import { usePatchesQueryParams } from "./usePatchesQueryParams";

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

  const { limit, page } = usePatchesQueryParams();

  return (
    <div className={styles.paginationRow}>
      <Pagination
        countLimit={PATCH_COUNT_LIMIT}
        currentPage={page}
        loading={loading}
        onPageChange={(newPage) =>
          sendEvent({
            name: "Changed page",
            "page.number": newPage,
          })
        }
        onPageSizeChange={(newPageSize) =>
          sendEvent({
            name: "Changed page size",
            "page.size": newPageSize,
          })
        }
        pageSize={limit}
        totalResults={filteredPatchCount}
      />
    </div>
  );
};
