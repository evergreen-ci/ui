import { useState } from "react";
import styled from "@emotion/styled";
import { Button, Size as ButtonSize } from "@leafygreen-ui/button";
import { palette } from "@leafygreen-ui/palette";
import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import { useTaskAnalytics } from "analytics";
import { CostModal } from "components/CostModal";
import {
  MetadataHeader,
  MetadataItem,
  MetadataLabel,
} from "components/MetadataCard";
import { Stepback } from "components/Stepback";
import { getTaskQueueRoute } from "constants/routes";
import { TaskQuery } from "gql/generated/types";
import { formatCost } from "utils/numbers";
import { isInStepback } from "utils/stepback";
import { AbortMessage } from "./AbortMessage";
import { DetailsDescription } from "./DetailsDescription";
import { TestSelection } from "./TestSelection";

const { red } = palette;

type Task = NonNullable<TaskQuery["task"]>;

interface ExecutionSectionProps {
  task: Task;
}

export const ExecutionSection: React.FC<ExecutionSectionProps> = ({ task }) => {
  const taskAnalytics = useTaskAnalytics();
  const [costModalOpen, setCostModalOpen] = useState(false);

  const {
    abortInfo,
    details,
    distroId,
    execution,
    finishTime,
    minQueuePosition: taskQueuePosition,
    priority,
    resetWhenFinished,
    startTime,
    status,
    stepbackInfo,
    taskCost,
    testSelectionEnabled,
  } = task;

  const showStepback = isInStepback(stepbackInfo);
  const oomTracker = details?.oomTracker;
  const { allowed: testSelectionEnabledForProject } =
    task.project?.testSelection || {};
  const hasDetailsDescription = details?.description || details?.failingCommand;

  const hasExecutionInfo =
    hasDetailsDescription ||
    (priority && priority > 0) ||
    (taskQueuePosition && taskQueuePosition > 0) ||
    abortInfo ||
    resetWhenFinished ||
    showStepback ||
    testSelectionEnabledForProject ||
    taskCost;

  return hasExecutionInfo ? (
    <>
      <MetadataHeader title="Execution" />
      {hasDetailsDescription && <DetailsDescription details={details} />}
      {details?.timeoutType && details?.timeoutType !== "" && (
        <MetadataItem>
          <MetadataLabel>Timeout type:</MetadataLabel> {details?.timeoutType}
        </MetadataItem>
      )}
      {priority && priority !== 0 ? (
        <MetadataItem data-cy="task-metadata-priority">
          <MetadataLabel>Priority:</MetadataLabel> {priority}{" "}
          {priority < 0 && `(Disabled)`}
        </MetadataItem>
      ) : null}
      {taskQueuePosition && taskQueuePosition > 0 ? (
        <MetadataItem>
          <MetadataLabel>Position in queue:</MetadataLabel>{" "}
          <StyledRouterLink
            data-cy="task-queue-position"
            to={getTaskQueueRoute(distroId, task.id)}
          >
            {taskQueuePosition}
          </StyledRouterLink>
        </MetadataItem>
      ) : null}
      {abortInfo && <AbortMessage {...abortInfo} />}
      {oomTracker && oomTracker.detected && (
        <OOMTrackerMessage>
          Out of Memory Kill detected{" "}
          {oomTracker.pids ? `(PIDs: ${oomTracker.pids.join(", ")})` : ""}
        </OOMTrackerMessage>
      )}
      {resetWhenFinished && (
        <MetadataItem>
          This task will restart when all of its sibling execution tasks have
          finished.
        </MetadataItem>
      )}
      {showStepback && (
        <MetadataItem as="div">
          <Stepback execution={execution} status={status} taskId={task.id} />
        </MetadataItem>
      )}
      {testSelectionEnabledForProject && (
        <TestSelection testSelectionEnabled={testSelectionEnabled} />
      )}
      {finishTime && taskCost?.total != null && (
        <MetadataItem data-cy="task-metadata-cost">
          <MetadataLabel>Cost: </MetadataLabel> ${formatCost(taskCost.total)}{" "}
          {taskCost.total > 0 && (
            <Button
              data-cy="cost-details-button"
              onClick={() => {
                taskAnalytics.sendEvent({
                  name: "Clicked cost details button",
                });
                setCostModalOpen(true);
              }}
              size={ButtonSize.XSmall}
            >
              Cost Details
            </Button>
          )}
        </MetadataItem>
      )}
      {taskCost && costModalOpen && (
        <CostModal
          {...taskCost}
          endTs={finishTime ?? undefined}
          name={task.displayName}
          open={costModalOpen}
          setOpen={setCostModalOpen}
          startTs={startTime ?? undefined}
          taskId={task.id}
        />
      )}
    </>
  ) : null;
};

const OOMTrackerMessage = styled(MetadataItem)`
  color: ${red.dark2};
  font-weight: 500;
`;
