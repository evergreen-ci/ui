import {
  tasks,
  collapsedGroupedTasks,
  expandedGroupedTasks,
} from "../testData";
import {
  getPrevPageCursor,
  getNextPageCursor,
  groupTasks,
  getUTCDate,
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

describe("getUTCDate", () => {
  beforeEach(() => {
    process.env.TZ = "America/New_York";
  });

  afterEach(() => {
    process.env.TZ = "UTC";
  });

  it("calculates the correct date", () => {
    let res = getUTCDate("2025-04-05", "Asia/Seoul");
    expect(res).toStrictEqual(new Date("2025-04-05T14:59:59.000Z"));

    res = getUTCDate("2025-04-05", "Pacific/Tahiti");
    expect(res).toStrictEqual(new Date("2025-04-06T09:59:59.000Z"));

    res = getUTCDate("2025-04-05", "Atlantic/Reykjavik");
    expect(res).toStrictEqual(new Date("2025-04-05T23:59:59.000Z"));

    res = getUTCDate("2025-04-05");
    expect(res).toStrictEqual(new Date("2025-04-06T03:59:59.000Z"));
  });
});
