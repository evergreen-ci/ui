import { useRef, useState } from "react";
import styled from "@emotion/styled";
import { IconButton } from "@leafygreen-ui/icon-button";
import { palette } from "@leafygreen-ui/palette";
import {
  Popover,
  Align,
  Justify,
  ToggleEvent,
  RenderMode,
} from "@leafygreen-ui/popover";
import { Overline } from "@leafygreen-ui/typography";
import { formatRelative } from "date-fns";
import TaskStatusBadge from "@evg-ui/lib/components/Badge/TaskStatusBadge";
import Icon from "@evg-ui/lib/components/Icon";
import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import { size } from "@evg-ui/lib/constants/tokens";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { PopoverContainer } from "components/styles/Popover";
import { statusColorMap } from "components/TaskBox";
import { getTaskRoute } from "constants/routes";
import { TaskTableInfo } from "./types";

const { gray } = palette;

export const PrevRunPopover: React.FC<{
  prevTaskCompleted: NonNullable<
    NonNullable<TaskTableInfo["baseTask"]>["prevTaskCompleted"]
  >;
}> = ({ prevTaskCompleted }) => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    setOpen((o) => !o);
  };

  const handleToggle = (e: ToggleEvent) => {
    const newOpen = e.newState === "open";
    setOpen(newOpen);
  };

  return (
    <>
      <IconButton
        ref={buttonRef}
        active={open}
        aria-label={`Previous run (${prevTaskCompleted.displayStatus}) details`}
        onClick={handleClick}
      >
        <Icon
          fill={
            statusColorMap[prevTaskCompleted.displayStatus as TaskStatus] ??
            gray.base
          }
          glyph={
            prevTaskCompleted.displayStatus === TaskStatus.Succeeded
              ? "ClockCheckmark"
              : "ClockX"
          }
        />
      </IconButton>
      <Popover
        active={open}
        align={Align.Top}
        justify={Justify.Start}
        onToggle={handleToggle}
        refEl={buttonRef}
        renderMode={RenderMode.TopLayer}
      >
        <PopoverContent>
          <StyledOverline>Last completed</StyledOverline>
          <div>
            <TaskStatusBadge
              status={prevTaskCompleted.displayStatus as TaskStatus}
            />{" "}
            {prevTaskCompleted.finishTime &&
              formatRelative(prevTaskCompleted.finishTime, new Date())}
          </div>
          <StyledRouterLink
            arrowAppearance="persist"
            to={getTaskRoute(prevTaskCompleted.id, {
              execution: prevTaskCompleted.execution,
            })}
          >
            View last run
          </StyledRouterLink>
        </PopoverContent>
      </Popover>
    </>
  );
};

const StyledOverline = styled(Overline)`
  color: ${gray.dark1};
`;

const PopoverContent = styled(PopoverContainer)`
  gap: ${size.xxs};
`;
