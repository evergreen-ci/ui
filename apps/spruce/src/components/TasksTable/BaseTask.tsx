import styled from "@emotion/styled";
import { IconButton } from "@leafygreen-ui/icon-button";
import { palette } from "@leafygreen-ui/palette";
import { Tooltip } from "@leafygreen-ui/tooltip";
import { Overline } from "@leafygreen-ui/typography";
import { formatRelative } from "date-fns";
import TaskStatusBadge from "@evg-ui/lib/components/Badge/TaskStatusBadge";
import Icon from "@evg-ui/lib/components/Icon";
import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import { LGColumnDef } from "@evg-ui/lib/components/Table";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { statusColorMap } from "components/TaskBox";
import TaskStatusBadgeWithLink from "components/TaskStatusBadgeWithLink";
import { getTableMode, TableMode } from "constants/featureFlags";
import { getTaskRoute } from "constants/routes";
import { TaskTableInfo } from "./types";

const { gray } = palette;

export const getBaseTaskCell = (({
  getValue,
  row: {
    original: { baseTask },
  },
}) => {
  const baseTaskStatus = getValue() as TaskStatus;
  const isInProgress =
    baseTaskStatus !== TaskStatus.Succeeded &&
    baseTaskStatus !== TaskStatus.Failed;

  const tableMode = getTableMode();

  if (!baseTask) {
    return <TaskStatusBadge status={getValue() as TaskStatus} />;
  }

  if (
    isInProgress &&
    baseTask?.prevTaskCompleted &&
    tableMode === TableMode.Inline
  ) {
    return (
      <Container>
        <TaskStatusBadgeWithLink
          execution={baseTask?.execution}
          id={baseTask?.id}
          status={getValue() as TaskStatus}
        />
        <Tooltip
          align="top"
          darkMode
          data-cy="copy-ssh-tooltip"
          trigger={
            <IconButton aria-label="GitHub Commit Link" data-cy="github-link">
              <Icon
                fill={
                  statusColorMap[
                    baseTask?.prevTaskCompleted?.displayStatus as TaskStatus
                  ] ?? gray.base
                }
                glyph="Clock"
              />
            </IconButton>
          }
          triggerEvent="click"
        >
          <Overline>Last completed</Overline>
          <div>
            <TaskStatusBadge
              status={baseTask.prevTaskCompleted.displayStatus as TaskStatus}
            />{" "}
            {baseTask.prevTaskCompleted.finishTime &&
              formatRelative(baseTask.prevTaskCompleted.finishTime, new Date())}
          </div>
          <StyledRouterLink
            to={getTaskRoute(baseTask.prevTaskCompleted.id, {
              execution: baseTask.prevTaskCompleted.execution,
            })}
          >
            View last run
          </StyledRouterLink>
        </Tooltip>
      </Container>
    );
  }

  return (
    <TaskStatusBadgeWithLink
      execution={baseTask?.execution}
      id={baseTask?.id}
      status={getValue() as TaskStatus}
    />
  );
}) satisfies LGColumnDef<TaskTableInfo>["cell"];

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;
