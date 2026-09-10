import tokens from "@via-ds/tokens";
import Icon from "@evg-ui/lib/components/Icon";
import { TaskStatus } from "@evg-ui/lib/types/task";

const { blue, green, neutral, purple, red, yellow } = tokens.color;

interface ExecutionStatusIconProps {
  status: string;
}

export const ExecutionStatusIcon: React.FC<ExecutionStatusIconProps> = ({
  status,
}) => {
  switch (status) {
    case TaskStatus.Succeeded:
      return <Icon fill={green["500"].$value} glyph="Checkmark" />;
    case TaskStatus.Failed:
      return <Icon fill={red["400"].$value} glyph="X" />;
    case TaskStatus.KnownIssue:
      return <Icon fill={red["400"].$value} glyph="KnownFailure" />;
    case TaskStatus.Dispatched:
    case TaskStatus.Started:
      return <Icon fill={yellow["400"].$value} glyph="Refresh" />;
    case TaskStatus.SetupFailed:
      return <Icon fill={blue["400"].$value} glyph="Wrench" />;
    case TaskStatus.SystemUnresponsive:
    case TaskStatus.SystemTimedOut:
    case TaskStatus.SystemFailed:
      return <Icon fill={purple["600"].$value} glyph="Settings" />;
    case TaskStatus.TestTimedOut:
    case TaskStatus.TaskTimedOut:
      return <Icon fill={red["400"].$value} glyph="ClockWithArrow" />;
    case TaskStatus.Aborted:
    case TaskStatus.Blocked:
    case TaskStatus.Unscheduled:
    case TaskStatus.Inactive:
    case TaskStatus.Undispatched:
      return <Icon fill={neutral["300"].$value} glyph="NotAllowed" />;
    case TaskStatus.WillRun:
    case TaskStatus.Pending:
    case TaskStatus.Unstarted:
      return <Icon fill={neutral["600"].$value} glyph="Calendar" />;
    default:
      return null;
  }
};

// @ts-expect-error: Must set this property in order to render icons in ExecutionSelector.
ExecutionStatusIcon.isGlyph = true;
