import { Badge, Variant } from "@leafygreen-ui/badge";
import { Tooltip, TriggerEvent } from "@leafygreen-ui/tooltip";

interface VirtualTaskBadgeProps {
  isPushCompleted: boolean;
}

export const VirtualTaskBadge: React.FC<VirtualTaskBadgeProps> = ({
  isPushCompleted,
}) => (
  <Tooltip
    data-testid="virtual-task-badge-tooltip"
    trigger={
      <span>
        <Badge data-testid="virtual-task-badge" variant={Variant.Blue}>
          Virtual
        </Badge>
      </span>
    }
    triggerEvent={TriggerEvent.Hover}
  >
    {isPushCompleted
      ? "This is a virtual task. Its results were pushed by another task, so it did not run on a host for this execution."
      : "This is a virtual task that ran on a host for this execution."}
  </Tooltip>
);
