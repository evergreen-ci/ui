import { TableProps } from "antd/es/table";
import { TestSortCategory } from "gql/generated/types";

export enum RequiredQueryParams {
  Sort = "sortDir",
  Category = "sortBy",
  Statuses = "statuses",
  TestName = "testname",
  Page = "page",
  Limit = "limit",
  Execution = "execution",
}

// TODO: Remove SortBy-Limit in favor of generic TableQueryParams
export enum PatchTasksQueryParams {
  SortBy = "sortBy",
  SortDir = "sortDir",
  Sorts = "sorts",
  Statuses = "statuses",
  BaseStatuses = "baseStatuses",
  Variant = "variant",
  TaskName = "taskName",
  Duration = "duration",
}

export enum TestAnalysisQueryParams {
  Statuses = "statuses",
  TestName = "testName",
  Variants = "variants",
}

export const mapFilterParamToId = {
  [RequiredQueryParams.Statuses]: TestSortCategory.Status,
  [RequiredQueryParams.TestName]: TestSortCategory.TestName,
} as const;

export const mapIdToFilterParam = Object.entries(mapFilterParamToId).reduce(
  (accum, [id, param]) => ({
    ...accum,
    [param]: id,
  }),
  {},
);

export type TableOnChange<D> = TableProps<D>["onChange"];

export enum TaskTab {
  Logs = "logs",
  Tests = "tests",
  Files = "files",
  ExecutionTasks = "execution-tasks",
  Annotations = "annotations",
  TrendCharts = "trend-charts",
}

export enum LogTypes {
  Agent = "agent",
  System = "system",
  Task = "task",
  Event = "event",
  All = "all",
}

export enum QueryParams {
  LogType = "logtype",
  TaskId = "taskId",
}

export enum TaskEventType {
  TaskFinished = "TASK_FINISHED",
  TaskStarted = "TASK_STARTED",
  TaskDispatched = "TASK_DISPATCHED",
  TaskBlocked = "TASK_BLOCKED",
  TaskUndispatched = "TASK_UNDISPATCHED",
  TaskCreated = "TASK_CREATED",
  TaskRestarted = "TASK_RESTARTED",
  TaskActivated = "TASK_ACTIVATED",
  TaskJiraAlertCreated = "TASK_JIRA_ALERT_CREATED",
  TaskDeactivated = "TASK_DEACTIVATED",
  TaskAbortRequest = "TASK_ABORT_REQUEST",
  TaskScheduled = "TASK_SCHEDULED",
  TaskPriorityChanged = "TASK_PRIORITY_CHANGED",
  TaskDependenciesOverridden = "TASK_DEPENDENCIES_OVERRIDDEN",
  MergeTaskUnscheduled = "MERGE_TASK_UNSCHEDULED",
  ContainerAllocated = "CONTAINER_ALLOCATED",
}
