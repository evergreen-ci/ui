import { palette } from "@leafygreen-ui/palette";
import { TaskStatus } from "@evg-ui/lib/types/task";

const { blue, gray, green, purple, red, yellow } = palette;

export const statusColorMap: Record<TaskStatus, string> = {
  [TaskStatus.Succeeded]: green.dark1,
  [TaskStatus.Started]: yellow.base,
  [TaskStatus.Dispatched]: yellow.base,
  [TaskStatus.SystemFailed]: purple.dark2,
  [TaskStatus.SystemTimedOut]: purple.dark2,
  [TaskStatus.SystemUnresponsive]: purple.dark2,
  [TaskStatus.Failed]: red.base,
  [TaskStatus.TaskTimedOut]: red.base,
  [TaskStatus.TestTimedOut]: red.base,
  [TaskStatus.KnownIssue]: red.light3,
  [TaskStatus.SetupFailed]: blue.base,
  [TaskStatus.Unscheduled]: gray.light1,
  [TaskStatus.Aborted]: gray.light1,
  [TaskStatus.Blocked]: gray.light1,
  [TaskStatus.Inactive]: gray.light1,
  [TaskStatus.Undispatched]: gray.dark1,
  [TaskStatus.WillRun]: gray.dark1,
  [TaskStatus.Pending]: gray.dark1,
  [TaskStatus.Unstarted]: gray.dark1,
};
