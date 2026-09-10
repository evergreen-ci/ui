import { Badge, BadgeVariant } from "@via-ds/components/badge";
import tokens from "@via-ds/tokens";
import IconWithTooltip from "@evg-ui/lib/components/IconWithTooltip";
import { HostStatus } from "types/host";
import styles from "./index.module.css";

const { red } = tokens.color;

interface Props {
  status: HostStatus;
}

const HostStatusBadge: React.FC<Props> = ({ status }) => (
  <div className={styles.hostStatusWrapper}>
    <Badge variant={statusToBadgeVariant[status]}>
      {hostStatusToCopy[status]}
    </Badge>
    {status === HostStatus.Terminated && (
      <IconWithTooltip
        className={styles.iconWithTooltip}
        fill={red["400"].$value}
        glyph="InfoWithCircle"
      >
        Terminated hosts will disappear in 5 minutes. See Event Log for more
        details.
      </IconWithTooltip>
    )}
  </div>
);

const statusToBadgeVariant = {
  [HostStatus.Running]: BadgeVariant.Success,
  [HostStatus.Terminated]: BadgeVariant.Error,
  [HostStatus.Provisioning]: BadgeVariant.Warning,
  [HostStatus.Starting]: BadgeVariant.Warning,
  [HostStatus.Decommissioned]: BadgeVariant.Status,
  [HostStatus.Quarantined]: BadgeVariant.Status,
  [HostStatus.ProvisionFailed]: BadgeVariant.Status,
  [HostStatus.BuildingFailed]: BadgeVariant.Status,
  [HostStatus.Uninitialized]: BadgeVariant.Status,
  [HostStatus.Building]: BadgeVariant.Status,
  [HostStatus.Success]: BadgeVariant.Status,
  [HostStatus.Stopping]: BadgeVariant.Status,
  [HostStatus.Stopped]: BadgeVariant.Status,
  [HostStatus.Failed]: BadgeVariant.Status,
  [HostStatus.ExternalUserName]: BadgeVariant.Status,
};

const hostStatusToCopy = {
  [HostStatus.Running]: "Running",
  [HostStatus.Terminated]: "Terminated",
  [HostStatus.Starting]: "Starting",
  [HostStatus.Provisioning]: "Provisioning",
  [HostStatus.Decommissioned]: "Decommissioned",
  [HostStatus.Quarantined]: "Quarantined",
  [HostStatus.ProvisionFailed]: "Provision Failed",
  [HostStatus.BuildingFailed]: "Build Failed",
  [HostStatus.Uninitialized]: "Initializing",
  [HostStatus.Building]: "Building",
  [HostStatus.Success]: "Success",
  [HostStatus.Stopping]: "Stopping",
  [HostStatus.Stopped]: "Stopped",
  [HostStatus.Failed]: "Failed",
  [HostStatus.ExternalUserName]: "External",
};

export default HostStatusBadge;
