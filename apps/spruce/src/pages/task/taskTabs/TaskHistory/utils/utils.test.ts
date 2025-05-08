import {
  tasks,
  collapsedGroupedTasks,
  expandedGroupedTasks,
} from "../testData";
import {
  getPrevPageCursor,
  getNextPageCursor,
  groupTasks,
  areDatesOnSameDay,
  getUTCEndOfDay,
} from ".";

describe("groupTasks", () => {
  it("groups inactive tasks if shouldCollapse is true", () => {
    const res = groupTasks(tasks, true);
    expect(res).toStrictEqual(collapsedGroupedTasks);
  });

  it("does not group inactive tasks if shouldCollapse is false", () => {
    const res = groupTasks(tasks, false);
    expect(res).toStrictEqual(expandedGroupedTasks);
  });
});

describe("getPrevPageCursor", () => {
  it("works with task item", () => {
    const res = getPrevPageCursor(collapsedGroupedTasks[0]);
    expect(res).toStrictEqual(tasks[0]);
  });

  it("works with inactive task item", () => {
    const res = getPrevPageCursor(collapsedGroupedTasks[6]);
    expect(res).toStrictEqual(tasks[6]);
  });
});

describe("getNextPageCursor", () => {
  it("works with task item", () => {
    const res = getNextPageCursor(collapsedGroupedTasks[0]);
    expect(res).toStrictEqual(tasks[0]);
  });

  it("works with inactive task item", () => {
    const res = getNextPageCursor(collapsedGroupedTasks[6]);
    expect(res).toStrictEqual(tasks[8]);
  });
});

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
});
describe("getUTCEndOfDay", () => {
  beforeEach(() => {
    process.env.TZ = "America/New_York";
  });

  afterEach(() => {
    process.env.TZ = "UTC";
  });

  it("returns undefined if date is null", () => {
    const res = getUTCEndOfDay(null);
    expect(res).toBeUndefined();
  });

  it("calculates the correct date", () => {
    let res = getUTCEndOfDay("2025-04-05", "Asia/Seoul");
    expect(res).toStrictEqual(new Date("2025-04-05T14:59:59.000Z"));

    res = getUTCEndOfDay("2025-04-05", "Pacific/Tahiti");
    expect(res).toStrictEqual(new Date("2025-04-06T09:59:59.000Z"));

    res = getUTCEndOfDay("2025-04-05", "Atlantic/Reykjavik");
    expect(res).toStrictEqual(new Date("2025-04-05T23:59:59.000Z"));

    res = getUTCEndOfDay("2025-04-05");
    expect(res).toStrictEqual(new Date("2025-04-06T03:59:59.000Z"));
  });
});
