import { skipToken, useQuery } from "@apollo/client/react";
import styled from "@emotion/styled";
import { Button, Size as ButtonSize } from "@leafygreen-ui/button";
import { Popover, Align, DismissMode } from "@leafygreen-ui/popover";
import { ListSkeleton } from "@leafygreen-ui/skeleton-loader";
import { Body } from "@leafygreen-ui/typography";
import { Link } from "react-router-dom";
import TaskStatusBadge from "@evg-ui/lib/components/Badge/TaskStatusBadge";
import { wordBreakCss, StyledRouterLink } from "@evg-ui/lib/components/styles";
import { size } from "@evg-ui/lib/constants/tokens";
import { TaskStatus } from "@evg-ui/lib/types/task";
import MetadataCard from "components/MetadataCard";
import { getParsleyTaskLogLink } from "constants/externalResources";
import { getDistroSettingsRoute, getTaskRoute } from "constants/routes";
import {
  TaskOverviewPopupQuery,
  TaskOverviewPopupQueryVariables,
} from "gql/generated/types";
import { TASK_OVERVIEW_POPUP } from "gql/queries";
import { LogTypes, TaskTab } from "types/task";
import { isFailedTaskStatus } from "utils/statuses";
import { msToDuration } from "utils/string";
import { Annotations } from "./Annotations";

interface Props {
  execution: number;
  open: boolean;
  setOpen: (o: boolean) => void;
  taskBoxRef: React.RefObject<HTMLElement>;
  taskId: string;
}

export const TaskOverviewPopup: React.FC<Props> = ({
  execution,
  open,
  setOpen,
  taskBoxRef,
  taskId,
}) => {
  const { data, loading } = useQuery<
    TaskOverviewPopupQuery,
    TaskOverviewPopupQueryVariables
  >(
    TASK_OVERVIEW_POPUP,
    open
      ? {
          variables: { taskId, execution },
          fetchPolicy: "no-cache",
        }
      : skipToken,
  );

  const { task } = data || {};
  const {
    annotation,
    details,
    displayName,
    displayStatus,
    distroId,
    finishTime,
    timeTaken,
  } = task || {};
  const { description, failingCommand } = details || {};
  const isFailingTask = isFailedTaskStatus(displayStatus);

  const command = description || failingCommand || "";

  const isLoading = loading && !task;

  return (
    <Popover
      active={open}
      align={Align.Right}
      dismissMode={DismissMode.Auto}
      onToggle={(e) => {
        if (e.newState === "open") {
          setOpen(true);
        } else {
          setOpen(false);
        }
      }}
      refEl={taskBoxRef}
    >
      <PopoverCard data-cy="task-overview-popup">
        {isLoading ? (
          <ListSkeleton />
        ) : (
          <>
            <TaskPageLink
              data-cy="task-link"
              to={getTaskRoute(taskId, { execution })}
            >
              {displayName}
            </TaskPageLink>
            <TaskStatusBadge status={displayStatus as TaskStatus} />
            {finishTime && timeTaken && timeTaken > 0 ? (
              <div>Duration: {msToDuration(timeTaken)}</div>
            ) : null}

            <ButtonRow>
              <Button
                as={Link}
                size={ButtonSize.Small}
                to={getParsleyTaskLogLink(LogTypes.Task, taskId, execution)}
              >
                Task logs
              </Button>
              <Button
                as={Link}
                size={ButtonSize.Small}
                to={getTaskRoute(taskId, {
                  execution,
                  tab: TaskTab.History,
                })}
              >
                Task history
              </Button>
            </ButtonRow>

            {distroId && (
              <div>
                <b>Distro: </b>
                <RouterLink
                  data-cy="task-distro-link"
                  to={getDistroSettingsRoute(distroId)}
                >
                  {distroId}
                </RouterLink>
              </div>
            )}
            {command && (
              <div>
                <b>{isFailingTask ? "Failing Command: " : "Command: "}</b>
                <Body>{command}</Body>
              </div>
            )}
            <Annotations annotation={annotation} />
          </>
        )}
      </PopoverCard>
    </Popover>
  );
};

const PopoverCard = styled(MetadataCard)`
  width: 330px;
  display: flex;
  flex-direction: column;
  gap: ${size.xs};
`;

const RouterLink = styled(StyledRouterLink)`
  ${wordBreakCss};
`;

const TaskPageLink = styled(RouterLink)`
  font-weight: bold;
  font-size: 18px;
`;

const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${size.xs};
`;
