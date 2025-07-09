import { useCallback } from "react";
import {
  RECENT_PAGE_SIZE_KEY,
  PaginationQueryParams,
} from "../../constants/pagination";
import { getDefaultPageSize } from "../../utils/pagination";
import { useQueryParam, useQueryParams } from "../useQueryParam";

/**
 * `usePagination` is a hook that manages the page and page size query params
 * It also saves the page size to local storage so that it can be remembered between sessions
 * Updating the page size will reset the page to 0
 * @returns - an object containing the current page, page size limit, and functions to update the page and page limit
 */
const usePagination = () => {
  const [queryParams, setQueryParams] = useQueryParams();
  const [page, setPage] = useQueryParam(PaginationQueryParams.Page, 0);
  const [limit] = useQueryParam(
    PaginationQueryParams.Limit,
    getDefaultPageSize(),
  );

  /**
   * `setLimit` updates the page size query param and saves the page size to local storage
   * @param pageSize - the new page size
   */
  const setLimit = useCallback(
    (pageSize: number) => {
      localStorage.setItem(RECENT_PAGE_SIZE_KEY, pageSize.toString());
      setQueryParams({
        ...queryParams,
        [PaginationQueryParams.Limit]: pageSize,
        [PaginationQueryParams.Page]: 0,
      });
    },
    [queryParams, setQueryParams],
  );

  return { page, limit, setLimit, setPage };
};

export default usePagination;
