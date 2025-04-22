import { areDatesOnSameDay } from "./utils";

describe("areDatesOnSameDay", () => {
  it("returns true for two identical Date objects", () => {
    const date = new Date("2024-04-22T10:00:00Z");
    expect(areDatesOnSameDay(date, date)).toBe(true);
  });

  it("returns true for different times on the same day", () => {
    const date1 = new Date("2024-04-22T00:00:00Z");
    const date2 = new Date("2024-04-22T23:59:59Z");
    expect(areDatesOnSameDay(date1, date2)).toBe(true);
  });

  it("returns false for different days", () => {
    const date1 = new Date("2024-04-21T23:59:59Z");
    const date2 = new Date("2024-04-22T00:00:00Z");
    expect(areDatesOnSameDay(date1, date2)).toBe(false);
  });

  it("returns false for same day of month but different months", () => {
    const date1 = new Date("2024-04-22T12:00:00Z");
    const date2 = new Date("2024-03-22T12:00:00Z");
    expect(areDatesOnSameDay(date1, date2)).toBe(false);
  });

  it("returns false for same month and date but different years", () => {
    const date1 = new Date("2023-04-22T12:00:00Z");
    const date2 = new Date("2024-04-22T12:00:00Z");
    expect(areDatesOnSameDay(date1, date2)).toBe(false);
  });

  it("handles dates in different time zones correctly", () => {
    const date1 = new Date("2024-04-22T00:00:00Z");
    const date2 = new Date("2024-04-22T00:00:00-0500"); // UTC-5
    expect(areDatesOnSameDay(date1, date2)).toBe(false);
  });
});
