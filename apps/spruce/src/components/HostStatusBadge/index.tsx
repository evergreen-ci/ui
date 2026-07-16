import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Badge, Variant } from "@leafygreen-ui/badge";
import { palette } from "@leafygreen-ui/palette";
import IconWithTooltip from "@evg-ui/lib/components/IconWithTooltip";
import { size } from "@evg-ui/lib/constants/tokens";
import { HostStatus } from "types/host";

const { red } = palette;

interface Props {
  status: HostStatus;
}

const HostStatusBadge: React.FC<Props> = ({ status }) => (
  <HostStatusWrapper>
    <Badge variant={statusToBadgeVariant[status]}>
      {hostStatusToCopy[status]}
    </Badge>
    {status === HostStatus.Terminated && (
      <IconWithTooltip css={iconMargin} fill={red.base} glyph="InfoWithCircle">
        Terminated hosts will disappear in 5 minutes. See Event Log for more
        details.
      </IconWithTooltip>
    )}
  </HostStatusWrapper>
);

const statusToBadgeVariant = {
  [HostStatus.Building]: Variant.LightGray,
  [HostStatus.BuildingFailed]: Variant.LightGray,
  [HostStatus.Decommissioned]: Variant.LightGray,
  [HostStatus.ExternalUserName]: Variant.LightGray,
  [HostStatus.Failed]: Variant.LightGray,
  [HostStatus.ProvisionFailed]: Variant.LightGray,
  [HostStatus.Provisioning]: Variant.Yellow,
  [HostStatus.Quarantined]: Variant.LightGray,
  [HostStatus.Running]: Variant.Green,
  [HostStatus.Starting]: Variant.Yellow,
  [HostStatus.Stopped]: Variant.LightGray,
  [HostStatus.Stopping]: Variant.LightGray,
  [HostStatus.Success]: Variant.LightGray,
  [HostStatus.Terminated]: Variant.Red,
  [HostStatus.Uninitialized]: Variant.LightGray,
};

const hostStatusToCopy = {
  [HostStatus.Building]: "Building",
  [HostStatus.BuildingFailed]: "Build Failed",
  [HostStatus.Decommissioned]: "Decommissioned",
  [HostStatus.ExternalUserName]: "External",
  [HostStatus.Failed]: "Failed",
  [HostStatus.ProvisionFailed]: "Provision Failed",
  [HostStatus.Provisioning]: "Provisioning",
  [HostStatus.Quarantined]: "Quarantined",
  [HostStatus.Running]: "Running",
  [HostStatus.Starting]: "Starting",
  [HostStatus.Stopped]: "Stopped",
  [HostStatus.Stopping]: "Stopping",
  [HostStatus.Success]: "Success",
  [HostStatus.Terminated]: "Terminated",
  [HostStatus.Uninitialized]: "Initializing",
};

const HostStatusWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const iconMargin = css`
  margin-left: ${size.xxs};
`;

export default HostStatusBadge;
