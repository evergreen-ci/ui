import { HostStatus } from "types/host";

interface Status {
  title: keyof typeof HostStatus | "Provision Failed" | "Building Failed";
  value: HostStatus;
  key: HostStatus;
}

export const hostStatuses: Status[] = [
  {
    title: "Running",
    value: HostStatus.Running,
    key: HostStatus.Running,
  },
  {
    title: "Building",
    value: HostStatus.Building,
    key: HostStatus.Building,
  },
  {
    title: "Starting",
    value: HostStatus.Starting,
    key: HostStatus.Starting,
  },
  {
    title: "Provisioning",
    value: HostStatus.Provisioning,
    key: HostStatus.Provisioning,
  },
  {
    title: "Uninitialized",
    value: HostStatus.Uninitialized,
    key: HostStatus.Uninitialized,
  },
  {
    title: "Provision Failed",
    value: HostStatus.ProvisionFailed,
    key: HostStatus.ProvisionFailed,
  },
  {
    title: "Quarantined",
    value: HostStatus.Quarantined,
    key: HostStatus.Quarantined,
  },
  {
    title: "Decommissioned",
    value: HostStatus.Decommissioned,
    key: HostStatus.Decommissioned,
  },
  {
    title: "Building Failed",
    value: HostStatus.BuildingFailed,
    key: HostStatus.BuildingFailed,
  },
];

export const MCI_USER = "mci";

export const defaultEC2Region = "us-east-1";
