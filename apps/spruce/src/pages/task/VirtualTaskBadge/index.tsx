import { Badge, BadgeVariant } from "@via-ds/components/badge";
import {
  Tooltip,
  TooltipRoot,
  TooltipTrigger,
} from "@via-ds/components/tooltip";

interface VirtualTaskBadgeProps {
  isPushCompleted: boolean;
}

export const VirtualTaskBadge: React.FC<VirtualTaskBadgeProps> = ({
  isPushCompleted,
}) => (
  <TooltipRoot align="center" side="top">
    <TooltipTrigger>
      <Badge data-testid="virtual-task-badge" variant={BadgeVariant.Info}>
        Virtual
      </Badge>
    </TooltipTrigger>
    <Tooltip data-testid="virtual-task-badge-tooltip">
      {isPushCompleted
        ? "Another task pushed the results for this execution, so this virtual task did not run on a host."
        : "This virtual task ran on a host for this execution."}
    </Tooltip>
  </TooltipRoot>
);
