import { palette } from "@leafygreen-ui/palette";
import { Icon } from "@evg-ui/lib/components";
import { TaskStatus } from "@evg-ui/lib/types";

const { blue, gray, green, purple, red, yellow } = palette;

interface ExecutionStatusIconProps {
  status: string;
}

export const ExecutionStatusIcon: React.FC<ExecutionStatusIconProps> = ({
  status,
}) => {
  switch (status) {
    case TaskStatus.Succeeded:
      return <Icon fill={green.dark1} glyph="Checkmark" />;
    case TaskStatus.Failed:
      return <Icon fill={red.base} glyph="X" />;
    case TaskStatus.KnownIssue:
      return <Icon fill={red.base} glyph="KnownFailure" />;
    case TaskStatus.Dispatched:
    case TaskStatus.Started:
      return <Icon fill={yellow.base} glyph="Refresh" />;
    case TaskStatus.SetupFailed:
      return <Icon fill={blue.base} glyph="Wrench" />;
    case TaskStatus.SystemUnresponsive:
    case TaskStatus.SystemTimedOut:
    case TaskStatus.SystemFailed:
      return <Icon fill={purple.dark2} glyph="Settings" />;
    case TaskStatus.TestTimedOut:
    case TaskStatus.TaskTimedOut:
      return <Icon fill={red.base} glyph="ClockWithArrow" />;
    case TaskStatus.Aborted:
    case TaskStatus.Blocked:
    case TaskStatus.Unscheduled:
    case TaskStatus.Inactive:
    case TaskStatus.Undispatched:
      return <Icon fill={gray.light1} glyph="NotAllowed" />;
    case TaskStatus.WillRun:
    case TaskStatus.Pending:
    case TaskStatus.Unstarted:
      return <Icon fill={gray.dark2} glyph="Calendar" />;
    default:
      return null;
  }
};

// @ts-expect-error: The only icon LeafyGreen cannot support is the KnownFailure icon.
ExecutionStatusIcon.isGlyph = true;
