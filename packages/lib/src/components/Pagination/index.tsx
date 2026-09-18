import { useState } from "react";
import { Pagination as ViaPagination } from "@via-ds/components";
import { PAGE_SIZES } from "../../constants/pagination";
import usePagination from "../../hooks/usePagination";

interface Props {
  countLimit?: number;
  currentPage: number;
  loading?: boolean;
  onPageChange?: (i: number) => void;
  onPageSizeChange?: (i: number) => void;
  pageSize?: number;
  totalResults: number;
}

/**
 * Pagination component for navigating between pages of data. By default, it will update the page query param in the URL.
 * @param props - React props passed to the component
 * @param props.countLimit - optional count for the max value that was queried for. Used to display "many" instead of an exact number
 * @param props.currentPage - the current page
 * @param props.loading - whether the data is currently loading. When true, the previous total results count is preserved to prevent flickering
 * @param props.onPageChange - callback function to be called when the page changes
 * @param props.onPageSizeChange - callback function to be called when the page size changes
 * @param props.pageSize - maximum number of results per page
 * @param props.totalResults - total number of results
 * @returns The Pagination component
 */
export const Pagination: React.FC<Props> = ({
  countLimit,
  currentPage,
  loading = false,
  onPageChange,
  onPageSizeChange,
  pageSize,
  totalResults,
}) => {
  const { setLimit, setPage } = usePagination();

  const [prevTotalResults, setPrevTotalResults] = useState(totalResults);
  if (!loading && totalResults !== prevTotalResults) {
    setPrevTotalResults(totalResults);
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    onPageChange?.(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setLimit(newPageSize);
    onPageSizeChange?.(newPageSize);
  };

  const numTotalItems =
    countLimit !== undefined && prevTotalResults >= countLimit
      ? undefined
      : prevTotalResults;

  return (
    <ViaPagination
      data-testid="pagination"
      isNextDisabled={
        numTotalItems === 0 ||
        (numTotalItems !== undefined &&
          (currentPage + 1) * (pageSize || PAGE_SIZES[0]) >= numTotalItems)
      }
      isPreviousDisabled={currentPage === 0}
      onPageChange={(newPage) => handlePageChange(newPage - 1)}
      onPageSizeChange={handlePageSizeChange}
      page={currentPage + 1}
      pageSize={pageSize || PAGE_SIZES[0]}
      pageSizeOptions={PAGE_SIZES}
      totalItems={numTotalItems}
    />
  );
};

export default Pagination;
