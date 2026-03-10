import Cookies from "js-cookie";
import {
  CASE_SENSITIVE,
  COPY_FORMAT,
  DRAWER_OPENED,
  EXPANDABLE_ROWS,
  FILTER_LOGIC,
  HAS_SEEN_SEARCHBAR_GUIDE_CUE,
  HIGHLIGHT_FILTERS,
  LAST_SELECTED_LOG_TYPE,
  PRETTY_PRINT_BOOKMARKS,
  STICKY_HEADERS,
  WRAP,
  WRAP_FORMAT,
  ZEBRA_STRIPING,
} from "constants/storageKeys";

const COOKIE_KEYS = [
  CASE_SENSITIVE,
  COPY_FORMAT,
  DRAWER_OPENED,
  EXPANDABLE_ROWS,
  FILTER_LOGIC,
  HAS_SEEN_SEARCHBAR_GUIDE_CUE,
  HIGHLIGHT_FILTERS,
  LAST_SELECTED_LOG_TYPE,
  PRETTY_PRINT_BOOKMARKS,
  STICKY_HEADERS,
  WRAP,
  WRAP_FORMAT,
  ZEBRA_STRIPING,
];

const migrateCookiesToLocalStorage = (): void => {
  try {
    for (const key of COOKIE_KEYS) {
      const value = Cookies.get(key);
      if (value !== undefined) {
        localStorage.setItem(key, value);
        Cookies.remove(key);
      }
    }
  } catch {
    // Silently fail if localStorage or cookies are unavailable.
  }
};

export { migrateCookiesToLocalStorage };
