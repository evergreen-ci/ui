import { TaskStatus } from "../types/task";

export const taskStatusToCopy: Record<TaskStatus, string> = {
  [TaskStatus.Aborted]: "Aborted",
  [TaskStatus.Blocked]: "Blocked",
  [TaskStatus.Dispatched]: "Dispatched",
  [TaskStatus.Failed]: "Failed",
  [TaskStatus.KnownIssue]: "Known Issue",
  [TaskStatus.Pending]: "Pending",
  [TaskStatus.Started]: "Running",
  [TaskStatus.SystemFailed]: "System Failed",
  [TaskStatus.SystemTimedOut]: "System Timed Out",
  [TaskStatus.SystemUnresponsive]: "System Unresponsive",
  [TaskStatus.SetupFailed]: "Setup Failed",
  [TaskStatus.Succeeded]: "Succeeded",
  [TaskStatus.TaskTimedOut]: "Task Timed Out",
  [TaskStatus.TestTimedOut]: "Test Timed Out",
  [TaskStatus.Unstarted]: "Unstarted",
  [TaskStatus.Unscheduled]: "Unscheduled",
  [TaskStatus.WillRun]: "Will Run",
  [TaskStatus.Inactive]: "Inactive",
  [TaskStatus.Undispatched]: "Undispatched",
};
