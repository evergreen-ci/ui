import {
  tasks,
  collapsedGroupedTasks,
  expandedGroupedTasks,
} from "../testData";
import {
  getPrevPageCursor,
  getNextPageCursor,
  groupTasks,
  expandVisibleInactiveTasks,
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

describe("expandVisibleInactiveTasks", () => {
  it("expands given inactive tasks", () => {
    const res = expandVisibleInactiveTasks(
      collapsedGroupedTasks,
      new Set([tasks[6].id, tasks[2].id]),
    );
    const expected = [
      ...collapsedGroupedTasks.slice(0, 3),
      {
        inactiveTasks: null,
        task: tasks[2],
      },
      ...collapsedGroupedTasks.slice(3, 7),
      {
        inactiveTasks: null,
        task: tasks[6],
      },
      {
        inactiveTasks: null,
        task: tasks[7],
      },
      {
        inactiveTasks: null,
        task: tasks[8],
      },
      ...collapsedGroupedTasks.slice(7),
    ];
    expect(res).toStrictEqual(expected);
  });
  it("returns the same array if no inactive tasks are expanded", () => {
    const res = expandVisibleInactiveTasks(
      collapsedGroupedTasks,
      new Set(),
    );
    expect(res).toStrictEqual(collapsedGroupedTasks);
  })
});
