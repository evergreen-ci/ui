import { palette } from "@leafygreen-ui/palette";
import { ALL_VALUE, TreeDataEntry } from "@evg-ui/lib/components/TreeSelect";
import { taskStatusToCopy } from "@evg-ui/lib/constants/task";
import { TaskStatus, TaskStatusUmbrella } from "@evg-ui/lib/types/task";

const { gray, green, purple, red, yellow } = palette;

const taskStatuses: TreeDataEntry[] = [
  {
    children: [
      {
        key: TaskStatus.Failed,
        title: taskStatusToCopy[TaskStatus.Failed],
        value: TaskStatus.Failed,
      },
      {
        key: TaskStatus.TaskTimedOut,
        title: taskStatusToCopy[TaskStatus.TaskTimedOut],
        value: TaskStatus.TaskTimedOut,
      },
      {
        key: TaskStatus.TestTimedOut,
        title: taskStatusToCopy[TaskStatus.TestTimedOut],
        value: TaskStatus.TestTimedOut,
      },
      {
        key: TaskStatus.KnownIssue,
        title: taskStatusToCopy[TaskStatus.KnownIssue],
        value: TaskStatus.KnownIssue,
      },
    ],
    key: TaskStatusUmbrella.Failed,
    title: taskStatusToCopy[TaskStatusUmbrella.Failed],
    value: TaskStatusUmbrella.Failed,
  },
  {
    key: TaskStatus.Succeeded,
    title: taskStatusToCopy[TaskStatus.Succeeded],
    value: TaskStatus.Succeeded,
  },
  {
    children: [
      {
        key: TaskStatus.Started,
        title: taskStatusToCopy[TaskStatus.Started],
        value: TaskStatus.Started,
      },
      {
        key: TaskStatus.Dispatched,
        title: taskStatusToCopy[TaskStatus.Dispatched],
        value: TaskStatus.Dispatched,
      },
    ],
    key: TaskStatusUmbrella.Running,
    title: taskStatusToCopy[TaskStatusUmbrella.Running],
    value: TaskStatusUmbrella.Running,
  },
  {
    children: [
      {
        key: TaskStatus.WillRun,
        title: taskStatusToCopy[TaskStatus.WillRun],
        value: TaskStatus.WillRun,
      },
      {
        key: TaskStatus.Pending,
        title: taskStatusToCopy[TaskStatus.Pending],
        value: TaskStatus.Pending,
      },
      {
        key: TaskStatus.Unstarted,
        title: taskStatusToCopy[TaskStatus.Unstarted],
        value: TaskStatus.Unstarted,
      },
    ],
    key: TaskStatusUmbrella.Scheduled,
    title: taskStatusToCopy[TaskStatusUmbrella.Scheduled],
    value: TaskStatusUmbrella.Scheduled,
  },
  {
    children: [
      {
        key: TaskStatus.SystemFailed,
        title: taskStatusToCopy[TaskStatus.SystemFailed],
        value: TaskStatus.SystemFailed,
      },
      {
        key: TaskStatus.SystemTimedOut,
        title: taskStatusToCopy[TaskStatus.SystemTimedOut],
        value: TaskStatus.SystemTimedOut,
      },
      {
        key: TaskStatus.SystemUnresponsive,
        title: taskStatusToCopy[TaskStatus.SystemUnresponsive],
        value: TaskStatus.SystemUnresponsive,
      },
    ],
    key: TaskStatusUmbrella.SystemFailure,
    title: taskStatusToCopy[TaskStatusUmbrella.SystemFailure],
    value: TaskStatusUmbrella.SystemFailure,
  },
  {
    children: [
      {
        key: TaskStatus.Unscheduled,
        title: taskStatusToCopy[TaskStatus.Unscheduled],
        value: TaskStatus.Unscheduled,
      },
      {
        key: TaskStatus.Aborted,
        title: taskStatusToCopy[TaskStatus.Aborted],
        value: TaskStatus.Aborted,
      },
      {
        key: TaskStatus.Blocked,
        title: taskStatusToCopy[TaskStatus.Blocked],
        value: TaskStatus.Blocked,
      },
    ],
    key: TaskStatus.Undispatched,
    title: taskStatusToCopy[TaskStatusUmbrella.Undispatched],
    value: TaskStatusUmbrella.Undispatched,
  },
  {
    key: TaskStatus.SetupFailed,
    title: taskStatusToCopy[TaskStatus.SetupFailed],
    value: TaskStatus.SetupFailed,
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
    key: ALL_VALUE,
    title: "All",
    value: ALL_VALUE,
  },
  ...taskStatuses,
];
type ColorScheme = {
  fill: string;
  border: string;
  text: string;
};

export const mapUmbrellaStatusColors: Record<string, ColorScheme> = {
  [TaskStatus.SetupFailed]: {
    border: purple.base,
    fill: purple.light2,
    text: purple.dark2,
  },
  [TaskStatus.Succeeded]: {
    border: green.light2,
    fill: green.light3,
    text: green.dark2,
  },
  [TaskStatusUmbrella.Failed]: {
    border: red.light2,
    fill: red.light3,
    text: red.dark2,
  },
  [TaskStatusUmbrella.Running]: {
    border: yellow.light2,
    fill: yellow.light3,
    text: yellow.dark2,
  },
  [TaskStatusUmbrella.Scheduled]: {
    border: gray.dark2,
    fill: gray.dark1,
    text: gray.light3,
  },
  [TaskStatusUmbrella.SystemFailure]: {
    border: purple.dark3,
    fill: purple.dark2,
    text: purple.light3,
  },
  [TaskStatusUmbrella.Undispatched]: {
    border: gray.light2,
    fill: gray.light3,
    text: gray.dark1,
  },
};

export const mapTaskToBarchartColor = {
  [TaskStatus.SetupFailed]: purple.light2,
  [TaskStatus.Succeeded]: green.dark1,
  [TaskStatusUmbrella.Failed]: red.base,
  [TaskStatusUmbrella.Running]: yellow.base,
  [TaskStatusUmbrella.Scheduled]: gray.base,
  [TaskStatusUmbrella.SystemFailure]: purple.dark2,
  [TaskStatusUmbrella.Undispatched]: gray.dark1,
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
