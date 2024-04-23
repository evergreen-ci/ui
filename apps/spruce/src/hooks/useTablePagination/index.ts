import { RECENT_PAGE_SIZE_KEY } from "constants/index";
import { PaginationQueryParams } from "constants/queryParams";
import { useQueryParam, useQueryParams } from "hooks/useQueryParam";
import { getDefaultPageSize } from "utils/url";

/**
 * `useTablePagination` is a hook that manages the page and page size query params
 * @returns - an object containing the current page, page size, and functions to update the page and page size
 */
const useTablePagination = () => {
  const [queryParams, setQueryParams] = useQueryParams();
  const [page, setPage] = useQueryParam(PaginationQueryParams.Page, 0);
  const [limit] = useQueryParam(
    PaginationQueryParams.Limit,
    getDefaultPageSize(),
  );

  /**
   * `setPageLimit` updates the page size query param and saves the page size to local storage
   * @param pageSize - the new page size
   */
  const setPageLimit = (pageSize: number) => {
    localStorage.setItem(RECENT_PAGE_SIZE_KEY, pageSize.toString());
    setQueryParams({
      ...queryParams,
      [PaginationQueryParams.Limit]: pageSize,
      [PaginationQueryParams.Page]: 0,
    });
  };

  return { page, limit, setPageLimit, setPage };
};

export default useTablePagination;
