import { Badge, Variant } from "@leafygreen-ui/badge";
import { PatchStatus } from "types/patch";

interface Props {
  status: string;
}

export const PatchStatusBadge: React.FC<Props> = ({ status }) => (
  <Badge variant={statusToBadgeVariant[status as PatchStatus]}>
    {patchStatusToCopy[status as PatchStatus]}
  </Badge>
);

const statusToBadgeVariant = {
  [PatchStatus.Aborted]: Variant.LightGray,
  [PatchStatus.Created]: Variant.LightGray,
  [PatchStatus.Failed]: Variant.Red,
  [PatchStatus.Started]: Variant.Yellow,
  [PatchStatus.Success]: Variant.Green,
  unconfigured: Variant.LightGray,
};

const patchStatusToCopy = {
  [PatchStatus.Aborted]: "Aborted",
  [PatchStatus.Created]: "Created",
  [PatchStatus.Failed]: "Failed",
  [PatchStatus.Started]: "Running",
  [PatchStatus.Success]: "Succeeded",
  unconfigured: "Unconfigured",
};
