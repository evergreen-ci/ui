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
  STORAGE_MIGRATION_COMPLETE,
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

const getCookie = (name: string): string | undefined => {
  const match = document.cookie.match(
    new RegExp(
      `(?:^|; )${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}=([^;]*)`,
    ),
  );
  return match ? decodeURIComponent(match[1]) : undefined;
};

const migrateCookiesToLocalStorage = (): void => {
  try {
    if (localStorage.getItem(STORAGE_MIGRATION_COMPLETE)) {
      return;
    }

    for (const key of COOKIE_KEYS) {
      const value = getCookie(key);
      if (value !== undefined) {
        localStorage.setItem(key, value);
      }
    }

    localStorage.setItem(STORAGE_MIGRATION_COMPLETE, "true");
  } catch {
    // Silently fail if localStorage or cookies are unavailable.
  }
};

export { migrateCookiesToLocalStorage };
