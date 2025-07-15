import {
  PAGE_SIZES,
  DEFAULT_PAGE_SIZE,
  RECENT_PAGE_SIZE_KEY,
} from "../../constants/pagination";

/**
 * Returns the most recent page size from local storage or the default page size
 * @returns The recent or default page size
 */
export const getDefaultPageSize = () => {
  const pageSizeFromLocalStorage = localStorage.getItem(RECENT_PAGE_SIZE_KEY);
  const pageSize = pageSizeFromLocalStorage
    ? parseInt(pageSizeFromLocalStorage, 10)
    : DEFAULT_PAGE_SIZE;

  return PAGE_SIZES.includes(pageSize) ? pageSize : DEFAULT_PAGE_SIZE;
};
