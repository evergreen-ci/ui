import { TaskStatus, TaskStatusUmbrella } from "../types/task";

export const taskStatusToCopy: Record<TaskStatus | TaskStatusUmbrella, string> =
  {
    [TaskStatus.Aborted]: "Aborted",
    [TaskStatus.Blocked]: "Blocked",
    [TaskStatus.Dispatched]: "Dispatched",
    [TaskStatus.Failed]: "Failed",
    [TaskStatus.Inactive]: "Inactive",
    [TaskStatus.KnownIssue]: "Known Issue",
    [TaskStatus.Pending]: "Pending",
    [TaskStatus.SetupFailed]: "Setup Failed",
    [TaskStatus.Started]: "Running",
    [TaskStatus.Succeeded]: "Succeeded",
    [TaskStatus.SystemFailed]: "System Failed",
    [TaskStatus.SystemTimedOut]: "System Timed Out",
    [TaskStatus.SystemUnresponsive]: "System Unresponsive",
    [TaskStatus.TaskTimedOut]: "Task Timed Out",
    [TaskStatus.TestTimedOut]: "Test Timed Out",
    [TaskStatus.Undispatched]: "Undispatched",
    [TaskStatus.Unscheduled]: "Unscheduled",
    [TaskStatus.Unstarted]: "Unstarted",
    [TaskStatus.WillRun]: "Will Run",

    [TaskStatusUmbrella.Failed]: "Failed",
    [TaskStatusUmbrella.Running]: "Running",
    [TaskStatusUmbrella.Scheduled]: "Scheduled",
    [TaskStatusUmbrella.SystemFailure]: "System Failed",
    [TaskStatusUmbrella.Undispatched]: "Undispatched",
  };
