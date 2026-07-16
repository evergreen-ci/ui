import { palette } from "@leafygreen-ui/palette";
import { TaskStatus } from "@evg-ui/lib/types/task";
import redOutlineX from "./RedOutlineX";
import whiteClockWithArrow from "./WhiteClockWithArrow";
import whiteGear from "./WhiteGear";
import whiteWrench from "./WhiteWrench";
import whiteX from "./WhiteX";

const { blue, gray, green, purple, red, yellow } = palette;

export const statusColorMap: Record<TaskStatus, string> = {
  [TaskStatus.Aborted]: gray.light1,
  [TaskStatus.Blocked]: gray.light1,
  [TaskStatus.Dispatched]: yellow.base,
  [TaskStatus.Failed]: red.base,
  [TaskStatus.Inactive]: gray.light1,
  [TaskStatus.KnownIssue]: red.light3,
  [TaskStatus.Pending]: gray.dark1,
  [TaskStatus.SetupFailed]: blue.base,
  [TaskStatus.Started]: yellow.base,
  [TaskStatus.Succeeded]: green.dark1,
  [TaskStatus.SystemFailed]: purple.dark2,
  [TaskStatus.SystemTimedOut]: purple.dark2,
  [TaskStatus.SystemUnresponsive]: purple.dark2,
  [TaskStatus.TaskTimedOut]: red.base,
  [TaskStatus.TestTimedOut]: red.base,
  [TaskStatus.Undispatched]: gray.dark1,
  [TaskStatus.Unscheduled]: gray.light1,
  [TaskStatus.Unstarted]: gray.dark1,
  [TaskStatus.WillRun]: gray.dark1,
};

export const statusIconMap: Partial<Record<TaskStatus, string>> = {
  [TaskStatus.Failed]: whiteX,
  [TaskStatus.KnownIssue]: redOutlineX,
  [TaskStatus.SetupFailed]: whiteWrench,
  [TaskStatus.SystemFailed]: whiteGear,
  [TaskStatus.SystemTimedOut]: whiteGear,
  [TaskStatus.SystemUnresponsive]: whiteGear,
  [TaskStatus.TaskTimedOut]: whiteClockWithArrow,
  [TaskStatus.TestTimedOut]: whiteClockWithArrow,
};
