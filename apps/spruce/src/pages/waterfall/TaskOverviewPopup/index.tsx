import { useRef } from "react";
import { skipToken, useQuery } from "@apollo/client/react";
import styled from "@emotion/styled";
import { Code } from "@leafygreen-ui/code";
import { css } from "@leafygreen-ui/emotion";
import { Popover, Align, DismissMode } from "@leafygreen-ui/popover";
import { ListSkeleton } from "@leafygreen-ui/skeleton-loader";
import TaskStatusBadge from "@evg-ui/lib/components/Badge/TaskStatusBadge";
import { wordBreakCss, StyledRouterLink } from "@evg-ui/lib/components/styles";
import { size } from "@evg-ui/lib/constants/tokens";
import { useOnClickOutside } from "@evg-ui/lib/hooks";
import { TaskStatus } from "@evg-ui/lib/types/task";
import MetadataCard from "components/MetadataCard";
import { Stepback } from "components/Stepback";
import { getDistroSettingsRoute, getTaskRoute } from "constants/routes";
import {
  TaskOverviewPopupQuery,
  TaskOverviewPopupQueryVariables,
} from "gql/generated/types";
import { TASK_OVERVIEW_POPUP } from "gql/queries";
import { isFailedTaskStatus } from "utils/statuses";
import { isInStepback } from "utils/stepback";
import { msToDuration } from "utils/string";
import { ActionButtons } from "./ActionButtons";
import { Annotations } from "./Annotations";
import { FailingTests } from "./FailingTests";

interface Props {
  execution: number;
  isRightmostBuild?: boolean;
  open: boolean;
  setOpen: (o: boolean) => void;
  taskBoxRef: React.RefObject<HTMLElement>;
  taskId: string;
}

export const TaskOverviewPopup: React.FC<Props> = ({
  execution,
  isRightmostBuild = false,
  open,
  setOpen,
  taskBoxRef,
  taskId,
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  useOnClickOutside([taskBoxRef, popoverRef], () => setOpen(false));

  const { data, loading } = useQuery<
    TaskOverviewPopupQuery,
    TaskOverviewPopupQueryVariables
  >(
    TASK_OVERVIEW_POPUP,
    open
      ? {
          variables: { taskId, execution },
          // TODO DEVPROD-27824: Remove when cache performance is fixed.
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
    status,
    stepbackInfo,
    timeTaken,
  } = task || {};
  const { description, failingCommand } = details || {};
  const isFailingTask = isFailedTaskStatus(displayStatus);

  const command = description || failingCommand || "";

  const isLoading = loading || !task;
  const showStepback = isInStepback(stepbackInfo);

  return (
    <Popover
      ref={popoverRef}
      active={open}
      align={isRightmostBuild ? Align.Left : Align.Right}
      dismissMode={DismissMode.Manual}
      refEl={taskBoxRef}
    >
      <PopoverCard data-cy="task-overview-popup">
        {isLoading ? (
          <ListSkeleton />
        ) : (
          <>
            <span>
              <TaskPageLink
                data-cy="task-link"
                to={getTaskRoute(taskId, { execution })}
              >
                {displayName}
              </TaskPageLink>
              <TaskStatusBadge status={displayStatus as TaskStatus} />
            </span>
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
              <CommandBlock>
                <b>{isFailingTask ? "Failing Command: " : "Command: "}</b>
                <Code className={codeBlockCss} language="none">
                  {command}
                </Code>
              </CommandBlock>
            )}
            {isFailingTask && (
              <FailingTests execution={execution} taskId={taskId} />
            )}
            {showStepback && (
              <Stepback
                execution={execution}
                isPopup
                status={status ?? ""}
                taskId={taskId}
              />
            )}
            <Annotations annotation={annotation} displayName={displayName} />
          </>
        )}
      </PopoverCard>
    </Popover>
  );
};

const PopoverCard = styled(MetadataCard)`
  width: 350px;
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
  margin-right: ${size.xs};
`;

const CommandBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${size.xxs};
`;

// Make words overflow to the next line.
const codeBlockCss = css`
  > div > pre {
    white-space: normal;
  }
`;
