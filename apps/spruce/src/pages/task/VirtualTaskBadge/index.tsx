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
        ? "This is a virtual task. Its results were pushed by another task, so it did not run on a host for this execution."
        : "This is a virtual task that ran on a host for this execution."}
    </Tooltip>
  </TooltipRoot>
);
