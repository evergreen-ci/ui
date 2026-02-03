import { PartialRecord } from "@evg-ui/lib/types";
import { HostsQueryVariables, HostSortBy } from "gql/generated/types";

export enum HostStatus {
  // green: host-running
  Running = "running",

  // yellow: host-starting
  Starting = "starting",
  Provisioning = "provisioning",
  Uninitialized = "uninitialized",

  // red: host-terminated
  Terminated = "terminated",

  // grey: host-unreachable
  Decommissioned = "decommissioned",
  Quarantined = "quarantined",
  ProvisionFailed = "provision failed",

  // sometimes shows not found error on old UI
  Building = "building",
  BuildingFailed = "building-failed",

  // doesn't show up on the hosts page
  Success = "success",
  Stopping = "stopping",
  Stopped = "stopped",
  Failed = "failed",
  ExternalUserName = "external",
}

export enum UpdateHostStatus {
  Running = "running",
  Quarantined = "quarantined",
  Decommissioned = "decommissioned",
  Terminated = "terminated",
  Stopped = "stopped",
}

export enum HostsTableFilterParams {
  CurrentTaskId = "currentTaskId",
  DistroId = "distroId",
  HostId = "hostId",
  StartedBy = "startedBy",
  Statuses = "statuses",
}

export const mapQueryParamToId: Record<HostsTableFilterParams, HostSortBy> = {
  [HostsTableFilterParams.HostId]: HostSortBy.Id,
  [HostsTableFilterParams.DistroId]: HostSortBy.Distro,
  [HostsTableFilterParams.Statuses]: HostSortBy.Status,
  [HostsTableFilterParams.CurrentTaskId]: HostSortBy.CurrentTask,
  [HostsTableFilterParams.StartedBy]: HostSortBy.Owner,
} as const;

export const mapIdToFilterParam: PartialRecord<
  HostSortBy,
  keyof HostsQueryVariables
> = Object.entries(mapQueryParamToId).reduce(
  (accum, [id, param]) => ({
    ...accum,
    [param]: id,
  }),
  {},
);
