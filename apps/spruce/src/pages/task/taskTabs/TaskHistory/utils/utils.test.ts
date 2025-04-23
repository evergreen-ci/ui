import {
  tasks,
  collapsedGroupedTasks,
  expandedGroupedTasks,
  collapsedGroupedTasksWithSomeInactiveTasksExpanded,
} from "../testData";
import { getPrevPageCursor, getNextPageCursor, groupTasks } from ".";

describe("groupTasks", () => {
  it("groups inactive tasks if shouldCollapse is true", () => {
    const res = groupTasks(tasks, true, []);
    expect(res).toStrictEqual(collapsedGroupedTasks);
  });

  it("does not group inactive tasks if shouldCollapse is false", () => {
    const res = groupTasks(tasks, false, []);
    expect(res).toStrictEqual(expandedGroupedTasks);
  });

  it("groups inactive tasks mod expanded inactive tasks if shouldCollapse is true", () => {
    const res = groupTasks(tasks, true, [["c", "e", "h"]]);
    expect(res).toStrictEqual(
      collapsedGroupedTasksWithSomeInactiveTasksExpanded,
    );
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
