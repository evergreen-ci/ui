import tokens from "@via-ds/tokens";
import { TaskStatus } from "@evg-ui/lib/types/task";

const { blue, green, neutral, purple, red, yellow } = tokens.color;

export const statusColorMap: Record<TaskStatus, string> = {
  [TaskStatus.Succeeded]: green["500"].$value,
  [TaskStatus.Started]: yellow["400"].$value,
  [TaskStatus.Dispatched]: yellow["400"].$value,
  [TaskStatus.SystemFailed]: purple["600"].$value,
  [TaskStatus.SystemTimedOut]: purple["600"].$value,
  [TaskStatus.SystemUnresponsive]: purple["600"].$value,
  [TaskStatus.Failed]: red["400"].$value,
  [TaskStatus.TaskTimedOut]: red["400"].$value,
  [TaskStatus.TestTimedOut]: red["400"].$value,
  [TaskStatus.KnownIssue]: red["100"].$value,
  [TaskStatus.SetupFailed]: blue["400"].$value,
  [TaskStatus.Unscheduled]: neutral["300"].$value,
  [TaskStatus.Aborted]: neutral["300"].$value,
  [TaskStatus.Blocked]: neutral["300"].$value,
  [TaskStatus.Inactive]: neutral["300"].$value,
  [TaskStatus.Undispatched]: neutral["500"].$value,
  [TaskStatus.WillRun]: neutral["500"].$value,
  [TaskStatus.Pending]: neutral["500"].$value,
  [TaskStatus.Unstarted]: neutral["500"].$value,
};
