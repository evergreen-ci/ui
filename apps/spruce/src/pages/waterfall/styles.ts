import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { wordBreakCss } from "components/styles";
import { size } from "constants/tokens";
import {
  redOutlineX,
  whiteX,
  whiteClockWithArrow,
  whiteGear,
  whiteWrench,
} from "./icons";

const { blue, gray, green, purple, red, yellow } = palette;

const BUILD_VARIANT_WIDTH = 200;
const INACTIVE_WIDTH = 80;

// TODO DEVPROD-11708: Update with dynamic column count
export const VERSION_LIMIT = 5;

export const columnBasis = css`
  flex-basis: calc(100% / ${VERSION_LIMIT});
`;

export const gridGroupCss = css`
  display: flex;
  gap: ${size.s};
  flex-grow: 1;
  padding-left: ${size.xs};
  padding-right: ${size.xs};
`;

export const BuildVariantTitle = styled.div`
  ${wordBreakCss}
  flex-grow: 0;
  flex-shrink: 0;
  width: ${BUILD_VARIANT_WIDTH}px;
`;

export const Row = styled.div`
  display: flex;
  gap: ${size.xs};
  margin-bottom: ${size.s};
`;

export const InactiveVersion = styled.div`
  width: ${INACTIVE_WIDTH}px;
`;

export const statusColorMap: Record<string, string> = {
  [TaskStatus.Succeeded]: green.dark1,
  [TaskStatus.Started]: yellow.base,
  [TaskStatus.Dispatched]: yellow.base,
  [TaskStatus.SystemFailed]: purple.dark2,
  [TaskStatus.SystemTimedOut]: purple.dark2,
  [TaskStatus.SystemUnresponsive]: purple.dark2,
  [TaskStatus.Failed]: red.base,
  [TaskStatus.TaskTimedOut]: red.base,
  [TaskStatus.TestTimedOut]: red.base,
  [TaskStatus.KnownIssue]: red.light3,
  [TaskStatus.SetupFailed]: blue.base,
  [TaskStatus.Unscheduled]: gray.light1,
  [TaskStatus.Aborted]: gray.light1,
  [TaskStatus.Blocked]: gray.light1,
  [TaskStatus.Inactive]: gray.light1,
  [TaskStatus.Undispatched]: gray.dark1,
  [TaskStatus.WillRun]: gray.dark1,
  [TaskStatus.Pending]: gray.dark1,
  [TaskStatus.Unstarted]: gray.dark1,
};

export const statusIconMap: Record<string, string> = {
  [TaskStatus.Failed]: whiteX,
  [TaskStatus.TaskTimedOut]: whiteClockWithArrow,
  [TaskStatus.TestTimedOut]: whiteClockWithArrow,
  [TaskStatus.SetupFailed]: whiteWrench,
  [TaskStatus.KnownIssue]: redOutlineX,
  [TaskStatus.SystemFailed]: whiteGear,
  [TaskStatus.SystemTimedOut]: whiteGear,
  [TaskStatus.SystemUnresponsive]: whiteGear,
};
