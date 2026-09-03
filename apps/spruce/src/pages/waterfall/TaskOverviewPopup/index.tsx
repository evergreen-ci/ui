import { skipToken, useQuery } from "@apollo/client/react";
import { Code } from "@leafygreen-ui/code"; // TODO(UXE-616): swap to Via CodeEditor
import { Body, Popover, PopoverRoot, Skeleton } from "@via-ds/components";
import TaskStatusBadge from "@evg-ui/lib/components/Badge/TaskStatusBadge";
import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { cx } from "@evg-ui/lib/utils/css";
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
import styles from "./index.module.css";

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
    <PopoverRoot
      isNonModal
      isOpen={open}
      onOpenChange={setOpen}
      referenceElement={taskBoxRef}
      side={isRightmostBuild ? "left" : "right"}
      triggerType="dialog"
    >
      <Popover>
        <MetadataCard
          className={styles.popoverCard}
          data-testid="task-overview-popup"
        >
          {isLoading ? (
            <Skeleton isLoading>
              <Body>Loading task details</Body>
              <Body>Loading task details</Body>
              <Body>Loading task details</Body>
            </Skeleton>
          ) : (
            <>
              <span>
                <StyledRouterLink
                  className={cx(styles.routerLink, styles.taskPageLink)}
                  data-testid="task-link"
                  to={getTaskRoute(taskId, { execution })}
                >
                  {displayName}
                </StyledRouterLink>
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
                  <StyledRouterLink
                    className={styles.routerLink}
                    data-testid="task-distro-link"
                    to={getDistroSettingsRoute(distroId)}
                  >
                    {distroId}
                  </StyledRouterLink>
                </div>
              )}
              {command && (
                <div className={styles.commandBlock}>
                  <b>{isFailingTask ? "Failing Command: " : "Command: "}</b>
                  <Code className={styles.codeBlock} language="none">
                    {command}
                  </Code>
                </div>
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
        </MetadataCard>
      </Popover>
    </PopoverRoot>
  );
};
