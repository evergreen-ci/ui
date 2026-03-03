import {
  CASE_SENSITIVE,
  STORAGE_MIGRATION_COMPLETE,
  WRAP,
} from "constants/storageKeys";
import { migrateCookiesToLocalStorage } from "utils/migrateCookiesToLocalStorage";

const setCookie = (name: string, value: string) => {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/`;
};

const getCookie = (name: string): string | undefined => {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
};

const clearAllCookies = () => {
  document.cookie.split(";").forEach((c) => {
    const name = c.split("=")[0].trim();
    if (name) {
      document.cookie = `${name}=; max-age=0; path=/`;
    }
  });
};

describe("migrateCookiesToLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
    clearAllCookies();
  });

  it("migrates cookie values to localStorage", () => {
    setCookie(CASE_SENSITIVE, "true");
    setCookie(WRAP, "false");

    migrateCookiesToLocalStorage();

    expect(localStorage.getItem(CASE_SENSITIVE)).toBe("true");
    expect(localStorage.getItem(WRAP)).toBe("false");
  });

  it("sets the migration complete flag", () => {
    migrateCookiesToLocalStorage();

    expect(localStorage.getItem(STORAGE_MIGRATION_COMPLETE)).toBe("true");
  });

  it("skips migration if already completed", () => {
    localStorage.setItem(STORAGE_MIGRATION_COMPLETE, "true");
    setCookie(CASE_SENSITIVE, "true");

    migrateCookiesToLocalStorage();

    expect(localStorage.getItem(CASE_SENSITIVE)).toBeNull();
    expect(getCookie(CASE_SENSITIVE)).toBe("true");
  });

  it("handles empty document.cookie gracefully", () => {
    expect(() => migrateCookiesToLocalStorage()).not.toThrow();
    expect(localStorage.getItem(STORAGE_MIGRATION_COMPLETE)).toBe("true");
  });

  it("overwrites existing localStorage values with cookie values", () => {
    localStorage.setItem(CASE_SENSITIVE, "false");
    setCookie(CASE_SENSITIVE, "true");

    migrateCookiesToLocalStorage();

    expect(localStorage.getItem(CASE_SENSITIVE)).toBe("true");
  });
});
