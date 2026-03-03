import {
  getLocalStorageBoolean,
  getLocalStorageString,
  setLocalStorageBoolean,
  setLocalStorageString,
} from "utils/localStorage";

describe("localStorage utilities", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("getLocalStorageString", () => {
    it("returns the stored value", () => {
      localStorage.setItem("test-key", "test-value");
      expect(getLocalStorageString("test-key")).toBe("test-value");
    });

    it("returns null for a missing key", () => {
      expect(getLocalStorageString("nonexistent")).toBeNull();
    });
  });

  describe("setLocalStorageString", () => {
    it("stores a value in localStorage", () => {
      setLocalStorageString("test-key", "test-value");
      expect(localStorage.getItem("test-key")).toBe("test-value");
    });

    it("overwrites an existing value", () => {
      localStorage.setItem("test-key", "old");
      setLocalStorageString("test-key", "new");
      expect(localStorage.getItem("test-key")).toBe("new");
    });
  });

  describe("getLocalStorageBoolean", () => {
    it("returns true when stored value is 'true'", () => {
      localStorage.setItem("flag", "true");
      expect(getLocalStorageBoolean("flag")).toBe(true);
    });

    it("returns false when stored value is 'false'", () => {
      localStorage.setItem("flag", "false");
      expect(getLocalStorageBoolean("flag")).toBe(false);
    });

    it("returns undefined when key is missing and no default is provided", () => {
      expect(getLocalStorageBoolean("missing")).toBeUndefined();
    });

    it("returns the default value when key is missing", () => {
      expect(getLocalStorageBoolean("missing", true)).toBe(true);
      expect(getLocalStorageBoolean("missing", false)).toBe(false);
    });

    it("returns false for non-boolean strings", () => {
      localStorage.setItem("flag", "yes");
      expect(getLocalStorageBoolean("flag")).toBe(false);
    });
  });

  describe("setLocalStorageBoolean", () => {
    it("stores true as 'true'", () => {
      setLocalStorageBoolean("flag", true);
      expect(localStorage.getItem("flag")).toBe("true");
    });

    it("stores false as 'false'", () => {
      setLocalStorageBoolean("flag", false);
      expect(localStorage.getItem("flag")).toBe("false");
    });
  });
});
