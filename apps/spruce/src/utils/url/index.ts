import {
  PAGE_SIZES,
  DEFAULT_PAGE_SIZE,
  RECENT_PAGE_SIZE_KEY,
} from "constants/index";

export const getDefaultPageSize = () => {
  const pageSizeFromLocalStorage: number = parseInt(
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    localStorage.getItem(RECENT_PAGE_SIZE_KEY),
    10,
  );

  return PAGE_SIZES.includes(pageSizeFromLocalStorage)
    ? pageSizeFromLocalStorage
    : DEFAULT_PAGE_SIZE;
};
