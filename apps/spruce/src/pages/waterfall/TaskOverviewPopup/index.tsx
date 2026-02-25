import { skipToken, useQuery } from "@apollo/client/react";
import styled from "@emotion/styled";
import { Popover, Align, DismissMode } from "@leafygreen-ui/popover";
import { ListSkeleton } from "@leafygreen-ui/skeleton-loader";
import { Body } from "@leafygreen-ui/typography";
import TaskStatusBadge from "@evg-ui/lib/components/Badge/TaskStatusBadge";
import { wordBreakCss, StyledRouterLink } from "@evg-ui/lib/components/styles";
import { size } from "@evg-ui/lib/constants/tokens";
import { TaskStatus } from "@evg-ui/lib/types/task";
import MetadataCard from "components/MetadataCard";
import { getDistroSettingsRoute, getTaskRoute } from "constants/routes";
import {
  TaskOverviewPopupQuery,
  TaskOverviewPopupQueryVariables,
} from "gql/generated/types";
import { TASK_OVERVIEW_POPUP } from "gql/queries";
import { isFailedTaskStatus } from "utils/statuses";
import { msToDuration } from "utils/string";
import { ActionButtons } from "./ActionButtons";
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
    priority,
    timeTaken,
  } = task || {};
  const { description, failingCommand } = details || {};
  const isFailingTask = isFailedTaskStatus(displayStatus);

  const command = description || failingCommand || "";

  const isLoading = loading || !task;

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
            <ActionButtons setOpen={setOpen} task={task} />
            {priority && priority > 0 ? (
              <div>
                <b>Priority: </b>
                {priority}
              </div>
            ) : null}
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
            <Annotations annotation={annotation} displayName={displayName} />
          </>
        )}
      </PopoverCard>
    </Popover>
  );
};

const PopoverCard = styled(MetadataCard)`
  width: 330px;
  max-height: 500px;
  overflow-y: auto;

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
