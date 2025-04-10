import { tasks } from "../testData";
import { groupTasks } from ".";

describe("groupTasks", () => {
  it("groups inactive tasks if shouldCollapse is true", () => {
    const res = groupTasks(tasks, true);
    expect(res).toStrictEqual([
      {
        inactiveTasks: null,
        task: tasks[0],
      },
      {
        inactiveTasks: null,
        task: tasks[1],
      },
      {
        inactiveTasks: [tasks[2]],
        task: null,
      },
      {
        inactiveTasks: null,
        task: tasks[3],
      },
      {
        inactiveTasks: [tasks[4]],
        task: null,
      },
      {
        inactiveTasks: null,
        task: tasks[5],
      },
      {
        inactiveTasks: [tasks[6], tasks[7], tasks[8]],
        task: null,
      },
      {
        inactiveTasks: null,
        task: tasks[9],
      },
      {
        inactiveTasks: null,
        task: tasks[10],
      },
    ]);
  });

  it("does not group inactive tasks if shouldCollapse is false", () => {
    const res = groupTasks(tasks, false);
    expect(res).toStrictEqual([
      {
        inactiveTasks: null,
        task: tasks[0],
      },
      {
        inactiveTasks: null,
        task: tasks[1],
      },
      {
        inactiveTasks: null,
        task: tasks[2],
      },
      {
        inactiveTasks: null,
        task: tasks[3],
      },
      {
        inactiveTasks: null,
        task: tasks[4],
      },
      {
        inactiveTasks: null,
        task: tasks[5],
      },
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
      {
        inactiveTasks: null,
        task: tasks[9],
      },
      {
        inactiveTasks: null,
        task: tasks[10],
      },
    ]);
  });
});
