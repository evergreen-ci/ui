import { TaskStatus } from "@evg-ui/lib/types/task";
import { GroupedTask, TaskHistoryTask } from "./types";

export const tasks: TaskHistoryTask[] = [
  {
    id: "a",
    activated: true,
    displayStatus: TaskStatus.Succeeded,
    execution: 0,
    order: 100,
    revision: "aef363719d0287e92cd83749a827bae",
    createTime: new Date("2025-04-03T10:22:13Z"),
    canRestart: true,
    versionMetadata: {
      id: "version_id",
      author: "Evergreen Admin",
      message: "DEVPROD-1234: A",
    },
  },
  {
    id: "b",
    activated: true,
    displayStatus: TaskStatus.WillRun,
    execution: 0,
    order: 99,
    revision: "b",
    createTime: new Date("2025-04-03T10:22:13Z"),
    canRestart: true,
    versionMetadata: {
      id: "version_id",
      author: "Evergreen Admin",
      message: "DEVPROD-1234: B",
    },
  },
  {
    id: "c",
    activated: false,
    displayStatus: TaskStatus.Unscheduled,
    execution: 0,
    order: 98,
    revision: "ce135c28ba11e9189cae",
    createTime: new Date("2025-04-03T10:22:13Z"),
    canRestart: true,
    versionMetadata: {
      id: "version_id",
      author: "Evergreen Admin",
      message: "DEVPROD-1234: C",
    },
  },
  {
    id: "d",
    activated: true,
    displayStatus: TaskStatus.SetupFailed,
    execution: 0,
    order: 97,
    revision: "d",
    createTime: new Date("2025-04-03T10:22:13Z"),
    canRestart: true,
    versionMetadata: {
      id: "version_id",
      author: "Evergreen Admin",
      message: "DEVPROD-1234: D",
    },
  },
  {
    id: "e",
    activated: false,
    displayStatus: TaskStatus.Unscheduled,
    execution: 0,
    order: 96,
    revision: "e",
    createTime: new Date("2025-04-03T10:22:13Z"),
    canRestart: true,
    versionMetadata: {
      id: "version_id",
      author: "Evergreen Admin",
      message: "DEVPROD-1234: E",
    },
  },
  {
    id: "f",
    activated: true,
    displayStatus: TaskStatus.Failed,
    execution: 0,
    order: 95,
    revision: "f",
    createTime: new Date("2025-04-03T10:22:13Z"),
    canRestart: true,
    versionMetadata: {
      id: "version_id",
      author: "Evergreen Admin",
      message: "DEVPROD-1234: F",
    },
  },
  {
    id: "g",
    activated: false,
    displayStatus: TaskStatus.Unscheduled,
    execution: 0,
    order: 94,
    revision: "g",
    createTime: new Date("2025-04-03T10:22:13Z"),
    canRestart: true,
    versionMetadata: {
      id: "version_id",
      author: "Evergreen Admin",
      message: "DEVPROD-1234: G",
    },
  },
  {
    id: "h",
    activated: false,
    displayStatus: TaskStatus.Unscheduled,
    execution: 0,
    order: 93,
    revision: "h",
    createTime: new Date("2025-04-03T10:22:13Z"),
    canRestart: true,
    versionMetadata: {
      id: "version_id",
      author: "Evergreen Admin",
      message: "DEVPROD-1234: H",
    },
  },
  {
    id: "i",
    activated: false,
    displayStatus: TaskStatus.Unscheduled,
    execution: 0,
    order: 92,
    revision: "i",
    createTime: new Date("2025-04-03T10:22:13Z"),
    canRestart: true,
    versionMetadata: {
      id: "version_id",
      author: "Evergreen Admin",
      message: "DEVPROD-1234: I",
    },
  },
  {
    id: "j",
    activated: true,
    displayStatus: TaskStatus.KnownIssue,
    execution: 0,
    order: 91,
    revision: "j",
    createTime: new Date("2025-04-03T10:22:13Z"),
    canRestart: true,
    versionMetadata: {
      id: "version_id",
      author: "Evergreen Admin",
      message: "DEVPROD-1234: J",
    },
  },
  {
    id: "k",
    activated: true,
    displayStatus: TaskStatus.SystemFailed,
    execution: 0,
    order: 90,
    revision: "k",
    createTime: new Date("2025-04-03T10:22:13Z"),
    canRestart: true,
    versionMetadata: {
      id: "version_id",
      author: "Evergreen Admin",
      message: "DEVPROD-1234: K",
    },
  },
];

export const collapsedGroupedTasks: GroupedTask[] = [
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
];

export const expandedGroupedTasks: GroupedTask[] = [
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
];
