import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import { useTaskAnalytics } from "analytics";
import { CostSummary } from "components/CostSummary";
import { MetadataItem, MetadataSection } from "components/MetadataCard";
import { Stepback } from "components/Stepback";
import { getTaskQueueRoute } from "constants/routes";
import { TaskQuery } from "gql/generated/types";
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

  const {
    abortInfo,
    details,
    distroId,
    execution,
    minQueuePosition: taskQueuePosition,
    priority,
    resetWhenFinished,
    status,
    stepbackInfo,
    testSelectionEnabled,
  } = task;

  const showStepback = isInStepback(stepbackInfo);
  const oomTracker = details?.oomTracker;
  const { allowed: testSelectionEnabledForProject } =
    task.project?.testSelection || {};

  return (
    <MetadataSection title="Execution">
      {details?.description || details?.failingCommand ? (
        <DetailsDescription details={details} />
      ) : null}
      {details?.timeoutType && details?.timeoutType !== "" ? (
        <MetadataItem label="Timeout type">{details?.timeoutType}</MetadataItem>
      ) : null}
      {priority && priority !== 0 ? (
        <MetadataItem data-cy="task-metadata-priority" label="Priority">
          {priority} {priority < 0 && `(Disabled)`}
        </MetadataItem>
      ) : null}
      {taskQueuePosition && taskQueuePosition > 0 ? (
        <MetadataItem label="Position in queue">
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
      <CostSummary
        onClickDetailsButton={() =>
          taskAnalytics.sendEvent({ name: "Clicked cost details button" })
        }
        task={task}
        type="task"
      />
    </MetadataSection>
  );
};

const OOMTrackerMessage = styled(MetadataItem)`
  color: ${red.dark2};
  font-weight: 500;
`;
