import { TaskStatus } from "@evg-ui/lib/types";

const ordering = [
  // red
  new Set([
    TaskStatus.Failed,
    TaskStatus.TestTimedOut,
    TaskStatus.TaskTimedOut,
  ]),
  // lavender
  new Set([TaskStatus.SetupFailed]),
  // purple
  new Set([
    TaskStatus.SystemFailed,
    TaskStatus.SystemUnresponsive,
    TaskStatus.SystemTimedOut,
  ]),
  // yellow
  new Set([TaskStatus.Started, TaskStatus.Dispatched]),
  // grey statuses fall here
  // green
  new Set([TaskStatus.Succeeded]),
];

const greyStatusIndex = 3.5;

// @ts-expect-error: FIXME. This comment was added by an automated script.
export const sortTasks = (a, b): number => {
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const findGroup = (status) => {
    const groupIndex = ordering.findIndex((statusGroup) =>
      statusGroup.has(status),
    );
    return groupIndex === -1 ? greyStatusIndex : groupIndex;
  };

  const aIndex = findGroup(a);
  const bIndex = findGroup(b);

  if (aIndex < bIndex) {
    return -1;
  }
  if (aIndex > bIndex) {
    return 1;
  }
  return 0;
};
