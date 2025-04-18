export enum PatchPageQueryParams {
  MergeQueue = "mergeQueue",
  PatchName = "patchName",
  Statuses = "statuses",
  Page = "page",
  Limit = "limit",
  Hidden = "hidden",
  Requesters = "requesters",
}

export enum PatchStatus {
  Unconfigured = "unconfigured",
  Created = "created",
  Failed = "failed",
  Started = "started",
  Success = "success",
  Aborted = "aborted",
}

export enum VersionPageTabs {
  Tasks = "tasks",
  Changes = "changes",
  Downstream = "downstream-projects",
  TaskDuration = "task-duration",
  TestAnalysis = "test-analysis",
  Timechart = "timechart",
}

export enum ConfigurePatchPageTabs {
  Tasks = "tasks",
  Changes = "changes",
  Parameters = "parameters",
}
export const ALL_PATCH_STATUS = "all";
