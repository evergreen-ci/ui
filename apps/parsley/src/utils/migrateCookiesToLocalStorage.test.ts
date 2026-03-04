import Cookies from "js-cookie";
import { CASE_SENSITIVE, WRAP } from "constants/storageKeys";
import { migrateCookiesToLocalStorage } from "utils/migrateCookiesToLocalStorage";

describe("migrateCookiesToLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
    Object.keys(Cookies.get()).forEach((key) => Cookies.remove(key));
  });

  it("migrates cookie values to localStorage", () => {
    Cookies.set(CASE_SENSITIVE, "true");
    Cookies.set(WRAP, "false");

    migrateCookiesToLocalStorage();

    expect(localStorage.getItem(CASE_SENSITIVE)).toBe("true");
    expect(localStorage.getItem(WRAP)).toBe("false");
  });

  it("handles empty document.cookie gracefully", () => {
    expect(() => migrateCookiesToLocalStorage()).not.toThrow();
  });

  it("overwrites existing localStorage values with cookie values", () => {
    localStorage.setItem(CASE_SENSITIVE, "false");
    Cookies.set(CASE_SENSITIVE, "true");

    migrateCookiesToLocalStorage();

    expect(localStorage.getItem(CASE_SENSITIVE)).toBe("true");
  });
});
