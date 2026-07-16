import { HostStatus } from "types/host";

interface Status {
  title: keyof typeof HostStatus | "Provision Failed" | "Building Failed";
  value: HostStatus;
  key: HostStatus;
}

export const hostStatuses: Status[] = [
  {
    key: HostStatus.Running,
    title: "Running",
    value: HostStatus.Running,
  },
  {
    key: HostStatus.Building,
    title: "Building",
    value: HostStatus.Building,
  },
  {
    key: HostStatus.Starting,
    title: "Starting",
    value: HostStatus.Starting,
  },
  {
    key: HostStatus.Provisioning,
    title: "Provisioning",
    value: HostStatus.Provisioning,
  },
  {
    key: HostStatus.Uninitialized,
    title: "Uninitialized",
    value: HostStatus.Uninitialized,
  },
  {
    key: HostStatus.ProvisionFailed,
    title: "Provision Failed",
    value: HostStatus.ProvisionFailed,
  },
  {
    key: HostStatus.Quarantined,
    title: "Quarantined",
    value: HostStatus.Quarantined,
  },
  {
    key: HostStatus.Decommissioned,
    title: "Decommissioned",
    value: HostStatus.Decommissioned,
  },
  {
    key: HostStatus.BuildingFailed,
    title: "Building Failed",
    value: HostStatus.BuildingFailed,
  },
];

export const MCI_USER = "mci";

export const defaultEC2Region = "us-east-1";
