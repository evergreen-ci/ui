import { TaskHistoryTask } from "../types";
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
        inactiveTasks: [tasks[1], tasks[2], tasks[3]],
        task: null,
      },
      {
        inactiveTasks: null,
        task: tasks[4],
      },
      {
        inactiveTasks: [tasks[5], tasks[6]],
        task: null,
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
    ]);
  });
});

export const tasks: TaskHistoryTask[] = [
  {
    id: "a",
    activated: true,
    displayStatus: "succeeded",
    execution: 0,
    order: 100,
  },
  {
    id: "b",
    activated: false,
    displayStatus: "undispatched",
    execution: 0,
    order: 99,
  },
  {
    id: "c",
    activated: false,
    displayStatus: "undispatched",
    execution: 0,
    order: 98,
  },
  {
    id: "d",
    activated: false,
    displayStatus: "unscheduled",
    execution: 0,
    order: 97,
  },
  {
    id: "e",
    activated: true,
    displayStatus: "failed",
    execution: 0,
    order: 96,
  },
  {
    id: "f",
    activated: false,
    displayStatus: "unscheduled",
    execution: 0,
    order: 95,
  },
  {
    id: "g",
    activated: false,
    displayStatus: "unscheduled",
    execution: 0,
    order: 94,
  },
];
