import { Badge, BadgeVariant } from "@via-ds/components";
import { PatchStatus } from "types/patch";

interface Props {
  status: string;
}

export const PatchStatusBadge: React.FC<Props> = ({ status }) => (
  <Badge variant={statusToBadgeVariant[status as PatchStatus]}>
    {patchStatusToCopy[status as PatchStatus]}
  </Badge>
);

const statusToBadgeVariant: Record<PatchStatus, BadgeVariant> = {
  [PatchStatus.Unconfigured]: BadgeVariant.Status,
  [PatchStatus.Created]: BadgeVariant.Status,
  [PatchStatus.Failed]: BadgeVariant.Error,
  [PatchStatus.Started]: BadgeVariant.Warning,
  [PatchStatus.Success]: BadgeVariant.Success,
  [PatchStatus.Aborted]: BadgeVariant.Status,
};

const patchStatusToCopy: Record<PatchStatus, string> = {
  [PatchStatus.Unconfigured]: "Unconfigured",
  [PatchStatus.Created]: "Created",
  [PatchStatus.Failed]: "Failed",
  [PatchStatus.Started]: "Running",
  [PatchStatus.Success]: "Succeeded",
  [PatchStatus.Aborted]: "Aborted",
};
