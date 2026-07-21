import {
  DEFAULT_ADMIN_DURATION,
  DISABLED_ADMIN_DURATION,
  adminDurationFromLegacy,
  getDurationMode,
  humanizeAdminDuration,
  validateAdminDuration,
  validateCustomDuration,
} from "./utils";

describe("admin duration utilities", () => {
  describe("validateAdminDuration", () => {
    it.each([
      "30s",
      "5m",
      "2h",
      "5d",
      "1w",
      "2h30m",
      "1.5h",
      "500ms",
      "1us",
      "1µs",
      "1ns",
      "0s",
      "-1s",
    ])("accepts %s", (duration) => {
      expect(validateAdminDuration(duration)).toBe(true);
    });

    it.each(["", "7", "7 days", " 5d", "1d 2h", "1x", "--1s", "0.1ns"])(
      "rejects %s",
      (duration) => {
        expect(validateAdminDuration(duration)).toBe(false);
      },
    );
  });

  it("only accepts positive durations as custom values", () => {
    expect(validateCustomDuration("5d")).toBe(true);
    expect(validateCustomDuration("0s")).toBe(false);
    expect(validateCustomDuration("-1s")).toBe(false);
  });

  it("identifies explicit modes from serialized values", () => {
    expect(getDurationMode(DEFAULT_ADMIN_DURATION)).toBe("default");
    expect(getDurationMode("2h30m")).toBe("custom");
    expect(getDurationMode(DISABLED_ADMIN_DURATION)).toBe("disabled");
  });

  it("prefers the duration and falls back to a legacy value", () => {
    expect(adminDurationFromLegacy("30m", 7, "d")).toBe("30m");
    expect(adminDurationFromLegacy(null, 7, "d")).toBe("7d");
    expect(adminDurationFromLegacy(undefined, 0, "d")).toBe(
      DEFAULT_ADMIN_DURATION,
    );
  });

  it("preserves duration units in the natural-language interpretation", () => {
    expect(humanizeAdminDuration("1w2d3h30m")).toBe(
      "1 week, 2 days, 3 hours, 30 minutes",
    );
  });
});
