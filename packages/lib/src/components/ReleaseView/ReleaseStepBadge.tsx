import { Badge, Variant as BadgeVariant } from "@leafygreen-ui/badge";
import { ReleaseStepStatus } from "./types";

const releaseStepStatusToBadgeVariant = (
  status: ReleaseStepStatus,
): BadgeVariant => {
  switch (status) {
    case ReleaseStepStatus.COMPLETED:
      return BadgeVariant.Green;
    case ReleaseStepStatus.IN_PROGRESS:
      return BadgeVariant.Blue;
    default:
      return BadgeVariant.LightGray;
  }
};

const releaseStepStatusToBadgeLabel = (status: ReleaseStepStatus): string => {
  switch (status) {
    case ReleaseStepStatus.COMPLETED:
      return "Completed";
    case ReleaseStepStatus.IN_PROGRESS:
      return "In Progress";
    default:
      return "Not Started";
  }
};

interface ReleaseStepBadgeProps {
  status: ReleaseStepStatus;
}
const ReleaseStepBadge: React.FC<ReleaseStepBadgeProps> = ({ status }) => (
  <Badge variant={releaseStepStatusToBadgeVariant(status)}>
    {releaseStepStatusToBadgeLabel(status)}
  </Badge>
);

export default ReleaseStepBadge;
