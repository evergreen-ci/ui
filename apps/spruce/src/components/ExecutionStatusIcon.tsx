import { palette } from "@leafygreen-ui/palette";
import Calendar from "@via-ds/icons/Calendar";
import Checkmark from "@via-ds/icons/Checkmark";
import ClockWithArrow from "@via-ds/icons/ClockWithArrow";
import NotAllowed from "@via-ds/icons/NotAllowed";
import Refresh from "@via-ds/icons/Refresh";
import Settings from "@via-ds/icons/Settings";
import Wrench from "@via-ds/icons/Wrench";
import X from "@via-ds/icons/X";
import Icon from "@evg-ui/lib/components/Icon";
import { TaskStatus } from "@evg-ui/lib/types/task";

const { blue, gray, green, purple, red, yellow } = palette;

interface ExecutionStatusIconProps {
  status: string;
}

export const ExecutionStatusIcon: React.FC<ExecutionStatusIconProps> = ({
  status,
}) => {
  switch (status) {
    case TaskStatus.Succeeded:
      return <Checkmark fill={green.dark1} />;
    case TaskStatus.Failed:
      return <X fill={red.base} />;
    case TaskStatus.KnownIssue:
      return <Icon fill={red.base} glyph="KnownFailure" />;
    case TaskStatus.Dispatched:
    case TaskStatus.Started:
      return <Refresh fill={yellow.base} />;
    case TaskStatus.SetupFailed:
      return <Wrench fill={blue.base} />;
    case TaskStatus.SystemUnresponsive:
    case TaskStatus.SystemTimedOut:
    case TaskStatus.SystemFailed:
      return <Settings fill={purple.dark2} />;
    case TaskStatus.TestTimedOut:
    case TaskStatus.TaskTimedOut:
      return <ClockWithArrow fill={red.base} />;
    case TaskStatus.Aborted:
    case TaskStatus.Blocked:
    case TaskStatus.Unscheduled:
    case TaskStatus.Inactive:
    case TaskStatus.Undispatched:
      return <NotAllowed fill={gray.light1} />;
    case TaskStatus.WillRun:
    case TaskStatus.Pending:
    case TaskStatus.Unstarted:
      return <Calendar fill={gray.dark2} />;
    default:
      return null;
  }
};

// @ts-expect-error: Must set this property in order to render icons in ExecutionSelector.
ExecutionStatusIcon.isGlyph = true;
