import { palette } from "@leafygreen-ui/palette";
import { ALL_VALUE, TreeDataEntry } from "@evg-ui/lib/components";
import { taskStatusToCopy } from "@evg-ui/lib/constants";
import { TaskStatus, TaskStatusUmbrella } from "@evg-ui/lib/types";

const { gray, green, purple, red, yellow } = palette;

const taskStatuses: TreeDataEntry[] = [
  {
    title: taskStatusToCopy[TaskStatusUmbrella.Failed],
    value: TaskStatusUmbrella.Failed,
    key: TaskStatusUmbrella.Failed,
    children: [
      {
        title: taskStatusToCopy[TaskStatus.Failed],
        value: TaskStatus.Failed,
        key: TaskStatus.Failed,
      },
      {
        title: taskStatusToCopy[TaskStatus.TaskTimedOut],
        value: TaskStatus.TaskTimedOut,
        key: TaskStatus.TaskTimedOut,
      },
      {
        title: taskStatusToCopy[TaskStatus.TestTimedOut],
        value: TaskStatus.TestTimedOut,
        key: TaskStatus.TestTimedOut,
      },
      {
        title: taskStatusToCopy[TaskStatus.KnownIssue],
        value: TaskStatus.KnownIssue,
        key: TaskStatus.KnownIssue,
      },
    ],
  },
  {
    title: taskStatusToCopy[TaskStatus.Succeeded],
    value: TaskStatus.Succeeded,
    key: TaskStatus.Succeeded,
  },
  {
    title: taskStatusToCopy[TaskStatusUmbrella.Running],
    value: TaskStatusUmbrella.Running,
    key: TaskStatusUmbrella.Running,
    children: [
      {
        title: taskStatusToCopy[TaskStatus.Started],
        value: TaskStatus.Started,
        key: TaskStatus.Started,
      },
      {
        title: taskStatusToCopy[TaskStatus.Dispatched],
        value: TaskStatus.Dispatched,
        key: TaskStatus.Dispatched,
      },
    ],
  },
  {
    title: taskStatusToCopy[TaskStatusUmbrella.Scheduled],
    value: TaskStatusUmbrella.Scheduled,
    key: TaskStatusUmbrella.Scheduled,
    children: [
      {
        title: taskStatusToCopy[TaskStatus.WillRun],
        value: TaskStatus.WillRun,
        key: TaskStatus.WillRun,
      },
      {
        title: taskStatusToCopy[TaskStatus.Pending],
        value: TaskStatus.Pending,
        key: TaskStatus.Pending,
      },
      {
        title: taskStatusToCopy[TaskStatus.Unstarted],
        value: TaskStatus.Unstarted,
        key: TaskStatus.Unstarted,
      },
    ],
  },
  {
    title: taskStatusToCopy[TaskStatusUmbrella.SystemFailure],
    value: TaskStatusUmbrella.SystemFailure,
    key: TaskStatusUmbrella.SystemFailure,
    children: [
      {
        title: taskStatusToCopy[TaskStatus.SystemFailed],
        value: TaskStatus.SystemFailed,
        key: TaskStatus.SystemFailed,
      },
      {
        title: taskStatusToCopy[TaskStatus.SystemTimedOut],
        value: TaskStatus.SystemTimedOut,
        key: TaskStatus.SystemTimedOut,
      },
      {
        title: taskStatusToCopy[TaskStatus.SystemUnresponsive],
        value: TaskStatus.SystemUnresponsive,
        key: TaskStatus.SystemUnresponsive,
      },
    ],
  },
  {
    title: taskStatusToCopy[TaskStatusUmbrella.Undispatched],
    value: TaskStatusUmbrella.Undispatched,
    key: TaskStatus.Undispatched,
    children: [
      {
        title: taskStatusToCopy[TaskStatus.Unscheduled],
        value: TaskStatus.Unscheduled,
        key: TaskStatus.Unscheduled,
      },
      {
        title: taskStatusToCopy[TaskStatus.Aborted],
        value: TaskStatus.Aborted,
        key: TaskStatus.Aborted,
      },
      {
        title: taskStatusToCopy[TaskStatus.Blocked],
        value: TaskStatus.Blocked,
        key: TaskStatus.Blocked,
      },
    ],
  },
  {
    title: taskStatusToCopy[TaskStatus.SetupFailed],
    value: TaskStatus.SetupFailed,
    key: TaskStatus.SetupFailed,
  },
];

export const mapTaskStatusToUmbrellaStatus: {
  [key: string]: string;
} = taskStatuses.reduce((accum, { children, value: parentValue }) => {
  const childrenParentMapping = children
    ? children.reduce(
        (cAccum, child) => ({ ...cAccum, [child.value]: parentValue }),
        {},
      )
    : { [parentValue]: parentValue };
  return {
    ...accum,
    ...childrenParentMapping,
  };
}, {});

export const mapUmbrellaStatusToQueryParam: {
  [key: string]: string[];
} = taskStatuses.reduce((accum, { children, value }) => {
  if (children) {
    return {
      ...accum,
      [value]: [value, ...children.map((child) => child.value)],
    };
  }
  return { ...accum, [value]: [value] };
}, {});

export const taskStatusesFilterTreeData: TreeDataEntry[] = [
  {
    title: "All",
    value: ALL_VALUE,
    key: ALL_VALUE,
  },
  ...taskStatuses,
];
type ColorScheme = {
  fill: string;
  border: string;
  text: string;
};

export const mapUmbrellaStatusColors: Record<string, ColorScheme> = {
  [TaskStatusUmbrella.Undispatched]: {
    fill: gray.light3,
    border: gray.light2,
    text: gray.dark1,
  },
  [TaskStatusUmbrella.Running]: {
    fill: yellow.light3,
    border: yellow.light2,
    text: yellow.dark2,
  },
  [TaskStatusUmbrella.SystemFailure]: {
    fill: purple.dark2,
    border: purple.dark3,
    text: purple.light3,
  },
  [TaskStatusUmbrella.Scheduled]: {
    fill: gray.dark1,
    border: gray.dark2,
    text: gray.light3,
  },
  [TaskStatusUmbrella.Failed]: {
    fill: red.light3,
    border: red.light2,
    text: red.dark2,
  },
  [TaskStatus.Succeeded]: {
    fill: green.light3,
    border: green.light2,
    text: green.dark2,
  },
  [TaskStatus.SetupFailed]: {
    fill: purple.light2,
    border: purple.base,
    text: purple.dark2,
  },
};

export const mapTaskToBarchartColor = {
  [TaskStatusUmbrella.Undispatched]: gray.dark1,
  [TaskStatusUmbrella.Running]: yellow.base,
  [TaskStatusUmbrella.SystemFailure]: purple.dark2,
  [TaskStatusUmbrella.Scheduled]: gray.base,
  [TaskStatusUmbrella.Failed]: red.base,
  [TaskStatus.Succeeded]: green.dark1,
  [TaskStatus.SetupFailed]: purple.light2,
};

// Represents order for waterfall barchart
export const sortedUmbrellaStatus = [
  TaskStatus.Succeeded,
  TaskStatusUmbrella.Failed,
  TaskStatusUmbrella.SystemFailure,
  TaskStatus.SetupFailed,
  TaskStatusUmbrella.Running,
  TaskStatusUmbrella.Scheduled,
  TaskStatusUmbrella.Undispatched,
];

export const failedTaskStatuses = [
  TaskStatus.Failed,
  TaskStatus.SetupFailed,
  TaskStatus.SystemFailed,
  TaskStatus.TaskTimedOut,
  TaskStatus.TestTimedOut,
  TaskStatus.KnownIssue,
  TaskStatus.SystemUnresponsive,
  TaskStatus.SystemTimedOut,
];

export const finishedTaskStatuses = [
  ...failedTaskStatuses,
  TaskStatus.Succeeded,
];
