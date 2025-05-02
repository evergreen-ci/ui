import {
  tasks,
  collapsedGroupedTasks,
  expandedGroupedTasks,
} from "../testData";
import { getPrevPageCursor, getNextPageCursor, groupTasks } from ".";

describe("groupTasks", () => {
  it("groups inactive tasks if shouldCollapse is true", () => {
    const res = groupTasks(tasks, true, null);
    expect(res).toStrictEqual(collapsedGroupedTasks);
  });

  it("does not group inactive tasks if shouldCollapse is false", () => {
    const res = groupTasks(tasks, false, null);
    expect(res).toStrictEqual(expandedGroupedTasks);
  });

  it("sets isMatching to true if testFailureSearchTerm matches a failing test", () => {
    const res = groupTasks(tasks, true, /e2e_test/);
    expect("isMatching" in res[5] && res[5].isMatching).toBe(true);
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
