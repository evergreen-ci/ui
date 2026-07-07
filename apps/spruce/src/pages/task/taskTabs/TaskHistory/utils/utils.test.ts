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
} from ".";

describe("groupTasks", () => {
  it("groups inactive tasks if shouldCollapse is true", () => {
    const res = groupTasks(tasks, {
      shouldCollapse: true,
      timezone: "America/New_York",
      testFailureSearchTerm: null,
    });
    expect(res).toStrictEqual(collapsedGroupedTasks);
  });

  it("does not group inactive tasks if shouldCollapse is false", () => {
    const res = groupTasks(tasks, {
      shouldCollapse: false,
      testFailureSearchTerm: null,
    });
    expect(res).toStrictEqual(expandedGroupedTasks);
  });

  it("sets isMatching to true if testFailureSearchTerm matches a failing test", () => {
    const res = groupTasks(tasks, {
      shouldCollapse: true,
      testFailureSearchTerm: /e2e_test/,
    });
    const filteredRes = res.filter((r) => r.date === null);
    expect(filteredRes[5].isMatching).toBe(true);
  });
});

describe("getPrevPageCursor", () => {
  it("works with task item", () => {
    const res = getPrevPageCursor(collapsedGroupedTasks);
    expect(res).toStrictEqual(tasks[0]);
  });

  it("prefers the first active task over a leading inactive group", () => {
    // This window starts with an inactive group (tasks[2]) but contains active tasks; the cursor
    // must be the first active task, since the inactive list is capped by the backend.
    const res = getPrevPageCursor(collapsedGroupedTasks.slice(3));
    expect(res).toStrictEqual(tasks[3]);
  });

  it("falls back to an inactive task when the window has no active task", () => {
    const res = getPrevPageCursor(collapsedGroupedTasks.slice(9, -3));
    expect(res).toStrictEqual(tasks[6]);
  });
});

describe("getNextPageCursor", () => {
  it("works with task item", () => {
    const res = getNextPageCursor(collapsedGroupedTasks);
    expect(res).toStrictEqual(tasks[10]);
  });

  it("prefers the last active task over a trailing inactive group", () => {
    // This window ends with an inactive group (tasks[6..8]) preceded by active task tasks[5].
    const res = getNextPageCursor(collapsedGroupedTasks.slice(0, 10));
    expect(res).toStrictEqual(tasks[5]);
  });

  it("falls back to an inactive task when the window has no active task", () => {
    const res = getNextPageCursor(collapsedGroupedTasks.slice(9, -3));
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

  it("accounts for timezone differences", () => {
    const date1 = new Date("2024-04-22T00:00:00Z"); // UTC
    const date2 = new Date("2024-04-21T23:00:00Z"); // UTC-1
    expect(areDatesOnSameDay(date1, date2, "America/New_York")).toBe(true);

    const date3 = new Date("2024-04-21T14:00:00Z"); // 2024-04-22 00:00 JST
    const date4 = new Date("2024-04-21T13:00:00Z"); // 2024-04-21 22:00 JST
    expect(areDatesOnSameDay(date3, date4, "Asia/Japan")).toBe(false);
  });
});
