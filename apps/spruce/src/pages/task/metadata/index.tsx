import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { InlineCode } from "@leafygreen-ui/typography";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { StyledLink, StyledRouterLink } from "@evg-ui/lib/components/styles";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { shortenGithash } from "@evg-ui/lib/utils/string";
import { size } from "@evg-ui/lib/constants/tokens";
import { useTaskAnalytics } from "analytics";
import { CopyableID } from "components/CopyableID";
import MetadataCard, {
  MetadataItem,
  MetadataLabel,
  MetadataSection,
  MetadataTitleWithAPILink,
} from "components/MetadataCard";
import { Stepback } from "components/Stepback";
import { getAPIRouteForTasks } from "constants/externalResources";
import {
  getHoneycombTraceUrl,
  getHoneycombSystemMetricsUrl,
} from "constants/externalResources/honeycomb";
import {
  getDistroSettingsRoute,
  getTaskQueueRoute,
  getTaskRoute,
  getHostRoute,
  getSpawnHostRoute,
  getProjectPatchesRoute,
  getImageRoute,
} from "constants/routes";
import { TaskQuery } from "gql/generated/types";
import { isInStepback } from "utils/stepback";
import { msToDuration } from "utils/string";
import { AbortMessage } from "./AbortMessage";
import { BuildVariantCard } from "./BuildVariant";
import { DependsOn } from "./DependsOn";
import DetailsDescription from "./DetailsDescription";
import ETATimer from "./ETATimer";
import RuntimeTimer from "./RuntimeTimer";
import TagsMetadata from "./TagsMetadata";
import TaskOwnership from "./TaskOwnership";
import { TaskTimingMetadata } from "./TaskTiming";
import { TestSelection } from "./TestSelection";
import { Timeline } from "./Timeline";

const { red } = palette;

interface Props {
  loading: boolean;
  task: TaskQuery["task"];
  error?: Error;
}

export const Metadata: React.FC<Props> = ({ error, loading, task }) => {
  const taskAnalytics = useTaskAnalytics();

  if (!task) {
    return (
      <MetadataCard error={error} loading={loading} title="Task Metadata">
        {" "}
      </MetadataCard>
    );
  }
  const {
    abortInfo,
    activatedTime,
    ami,
    annotation,
    baseTask,
    buildId,
    buildVariant,
    buildVariantDisplayName,
    dependsOn,
    details,
    displayStatus,
    displayTask,
    distroId,
    estimatedStart,
    execution,
    executionTasksFull,
    expectedDuration,
    finishTime,
    generatedBy,
    generatedByName,
    hostId,
    id: taskId,
    imageId,
    ingestTime,
    minQueuePosition: taskQueuePosition,
    priority,
    project,
    resetWhenFinished,
    spawnHostLink,
    startTime,
    stepbackInfo,
    tags,
    testSelectionEnabled,
    timeTaken,
    versionMetadata,
  } = task;

  const isDisplayTask = executionTasksFull != null;
  const {
    id: baseTaskId,
    timeTaken: baseTaskDuration,
    versionMetadata: baseTaskVersionMetadata,
  } = baseTask ?? {};
  const baseCommit = shortenGithash(baseTaskVersionMetadata?.revision);
  const {
    id: projectID,
    identifier: projectIdentifier,
    owner,
    repo,
    testSelection,
  } = project || {};
  const { allowed: testSelectionEnabledForProject } = testSelection || {};
  const { user } = versionMetadata ?? {};
  const oomTracker = details?.oomTracker;
  const taskTrace = details?.traceID;
  const diskDevices = details?.diskDevices;
  const { metadataLinks } = annotation ?? {};

  const showStepback = isInStepback(stepbackInfo);

  const timelineEvents = useMemo(
    () =>
      [
        ingestTime && {
          label: "Submitted",
          time: ingestTime,
          "data-cy": "task-metadata-submitted-at",
        },
        activatedTime && {
          label: "Activated",
          time: activatedTime,
          "data-cy": "task-metadata-activated-at",
        },
        startTime && {
          label: "Started",
          time: startTime,
          "data-cy": "task-metadata-started",
        },
        finishTime && {
          label: "Finished",
          time: finishTime,
          "data-cy": "task-metadata-finished",
        },
      ].filter(Boolean) as Array<{
        label: string;
        time: Date;
        "data-cy": string;
      }>,
    [ingestTime, activatedTime, startTime, finishTime],
  );

  const hasTimingData =
    timelineEvents.length > 0 ||
    (estimatedStart && estimatedStart > 0) ||
    (displayStatus === TaskStatus.Started && startTime) ||
    (finishTime && timeTaken && timeTaken > 0) ||
    baseTaskDuration;

  const hasAlerts =
    abortInfo || (oomTracker && oomTracker.detected) || resetWhenFinished;

  const hasLinks =
    (startTime && finishTime) || (metadataLinks && metadataLinks.length > 0);

  return (
    <>
      <MetadataCard
        title={
          <MetadataTitleWithAPILink
            href={getAPIRouteForTasks(taskId, execution)}
            title="Task Metadata"
          />
        }
      >
        <CopyableID textToCopy={taskId} tooltipLabel="Copy task ID" />

        {/* General Section */}
        <MetadataSection label="General">
          <MetadataItem data-cy="task-metadata-project">
            <MetadataLabel>Project:</MetadataLabel>{" "}
            <StyledRouterLink
              data-cy="project-link"
              onClick={() =>
                taskAnalytics.sendEvent({
                  name: "Clicked metadata link",
                  "link.type": "project link",
                })
              }
              to={getProjectPatchesRoute(
                projectIdentifier || projectID || "",
              )}
            >
              {projectIdentifier || `${owner}/${repo}`}
            </StyledRouterLink>
          </MetadataItem>
          <MetadataItem>
            <MetadataLabel>Submitted by:</MetadataLabel> {user.userId}
          </MetadataItem>
          <TaskOwnership execution={execution} taskId={taskId} />
          {generatedBy && (
            <MetadataItem>
              <MetadataLabel>Generated by:</MetadataLabel>{" "}
              <StyledRouterLink to={getTaskRoute(generatedBy)}>
                {generatedByName}
              </StyledRouterLink>
            </MetadataItem>
          )}
        </MetadataSection>

        {/* Timeline Section */}
        {hasTimingData && (
          <MetadataSection label="Timeline">
            <Timeline events={timelineEvents} />
            {estimatedStart && estimatedStart > 0 ? (
              <DurationRow data-cy="task-metadata-estimated-start">
                <MetadataLabel>Est. time to start:</MetadataLabel>{" "}
                {msToDuration(estimatedStart)}
              </DurationRow>
            ) : null}
            {displayStatus === TaskStatus.Started &&
            startTime &&
            expectedDuration ? (
              <ETATimer
                expectedDuration={expectedDuration}
                startTime={startTime}
              />
            ) : null}
            {displayStatus === TaskStatus.Started && startTime && (
              <RuntimeTimer startTime={startTime} />
            )}
            {finishTime && timeTaken && timeTaken > 0 ? (
              <DurationRow data-cy="task-metadata-duration">
                <MetadataLabel>Duration:</MetadataLabel>{" "}
                {msToDuration(timeTaken)}
              </DurationRow>
            ) : null}
            {baseTaskDuration ? (
              <DurationRow data-cy="task-metadata-base-commit-duration">
                <MetadataLabel>Base commit duration:</MetadataLabel>{" "}
                {msToDuration(baseTaskDuration)}
              </DurationRow>
            ) : null}
          </MetadataSection>
        )}

        {/* Execution Section */}
        <MetadataSection label="Execution">
          {(details?.description || details?.failingCommand) && (
            <DetailsDescription details={details} />
          )}
          {baseTaskId && (
            <MetadataItem>
              <MetadataLabel>Base commit:</MetadataLabel>{" "}
              <InlineCode
                as={Link as any}
                data-cy="base-task-link"
                onClick={() =>
                  taskAnalytics.sendEvent({
                    name: "Clicked metadata link",
                    "link.type": "base commit",
                  })
                }
                to={getTaskRoute(baseTaskId)}
              >
                {baseCommit}
              </InlineCode>
            </MetadataItem>
          )}
          {details?.timeoutType && details?.timeoutType !== "" && (
            <MetadataItem>
              <MetadataLabel>Timeout type:</MetadataLabel>{" "}
              {details?.timeoutType}
            </MetadataItem>
          )}
          {displayTask && (
            <MetadataItem>
              <MetadataLabel>Display Task:</MetadataLabel>{" "}
              <StyledRouterLink
                onClick={() =>
                  taskAnalytics.sendEvent({
                    name: "Clicked metadata link",
                    "link.type": "display task link",
                  })
                }
                to={getTaskRoute(displayTask.id, {
                  execution: displayTask.execution,
                })}
              >
                {displayTask.displayName}
              </StyledRouterLink>
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
                to={getTaskQueueRoute(distroId, taskId)}
              >
                {taskQueuePosition}
              </StyledRouterLink>
            </MetadataItem>
          ) : null}
          {showStepback && (
            <MetadataItem as="div">
              <Stepback taskId={taskId} />
            </MetadataItem>
          )}
          {testSelectionEnabledForProject && (
            <TestSelection testSelectionEnabled={testSelectionEnabled} />
          )}
        </MetadataSection>

        {/* Alerts Section */}
        {hasAlerts && (
          <MetadataSection label="Alerts">
            {abortInfo && <AbortMessage {...abortInfo} />}
            {oomTracker && oomTracker.detected && (
              <AlertBanner variant="error">
                Out of Memory Kill detected{" "}
                {oomTracker.pids
                  ? `(PIDs: ${oomTracker.pids.join(", ")})`
                  : ""}
              </AlertBanner>
            )}
            {resetWhenFinished && (
              <AlertBanner variant="info">
                This task will restart when all of its sibling execution tasks
                have finished.
              </AlertBanner>
            )}
          </MetadataSection>
        )}

        {/* Links Section */}
        {hasLinks && (
          <MetadataSection label="Links">
            {metadataLinks &&
              metadataLinks.map((link) => (
                <MetadataItem key={link.text}>
                  <StyledLink
                    data-cy="task-metadata-link"
                    href={link.url}
                    onClick={() =>
                      taskAnalytics.sendEvent({
                        name: "Clicked metadata link",
                        "link.type": "annotation link",
                      })
                    }
                  >
                    {link.text}
                  </StyledLink>
                </MetadataItem>
              ))}
            {startTime && finishTime && (
              <LinkGroup>
                {taskTrace && (
                  <StyledLink
                    data-cy="task-trace-link"
                    hideExternalIcon={false}
                    href={getHoneycombTraceUrl(
                      taskTrace,
                      startTime,
                      finishTime,
                    )}
                    onClick={() => {
                      taskAnalytics.sendEvent({
                        name: "Clicked metadata link",
                        "link.type": "honeycomb trace link",
                      });
                    }}
                  >
                    Honeycomb Trace
                  </StyledLink>
                )}
                <StyledLink
                  data-cy="task-metrics-link"
                  hideExternalIcon={false}
                  href={getHoneycombSystemMetricsUrl(
                    taskId,
                    // @ts-expect-error: FIXME. This comment was added by an automated script.
                    diskDevices,
                    startTime,
                    finishTime,
                  )}
                  onClick={() => {
                    taskAnalytics.sendEvent({
                      name: "Clicked metadata link",
                      "link.type": "honeycomb metrics link",
                    });
                  }}
                >
                  Honeycomb System Metrics
                </StyledLink>
              </LinkGroup>
            )}
          </MetadataSection>
        )}
      </MetadataCard>

      <BuildVariantCard
        buildId={buildId}
        buildVariant={buildVariant}
        buildVariantDisplayName={buildVariantDisplayName ?? ""}
        projectIdentifier={projectIdentifier}
        taskName={displayTask ? displayTask.displayName : task.displayName}
      />

      {projectIdentifier && !isDisplayTask && (
        <TaskTimingMetadata
          buildVariant={task.buildVariant}
          projectIdentifier={projectIdentifier}
          taskName={task.displayName}
        />
      )}

      {!isDisplayTask && (
        <MetadataCard loading={loading} title="Host Information">
          {hostId && (
            <MetadataItem>
              <MetadataLabel>ID:</MetadataLabel>{" "}
              <StyledLink
                data-cy="task-host-link"
                href={getHostRoute(hostId)}
                onClick={() =>
                  taskAnalytics.sendEvent({
                    name: "Clicked metadata link",
                    "link.type": "host link",
                  })
                }
              >
                {hostId}
              </StyledLink>
            </MetadataItem>
          )}
          {distroId && (
            <MetadataItem>
              <MetadataLabel>Distro:</MetadataLabel>{" "}
              <StyledRouterLink
                data-cy="task-distro-link"
                onClick={() =>
                  taskAnalytics.sendEvent({
                    name: "Clicked metadata link",
                    "link.type": "distro link",
                  })
                }
                to={getDistroSettingsRoute(distroId)}
              >
                {distroId}
              </StyledRouterLink>
            </MetadataItem>
          )}
          {imageId && (
            <MetadataItem>
              <MetadataLabel>Image:</MetadataLabel>{" "}
              <StyledRouterLink
                data-cy="task-image-link"
                onClick={() =>
                  taskAnalytics.sendEvent({
                    name: "Clicked metadata link",
                    "link.type": "image link",
                  })
                }
                to={getImageRoute(imageId)}
              >
                {imageId}
              </StyledRouterLink>
            </MetadataItem>
          )}
          {ami && (
            <MetadataItem data-cy="task-metadata-ami">
              <MetadataLabel>AMI:</MetadataLabel> {ami}
            </MetadataItem>
          )}
          {spawnHostLink && (
            <MetadataItem>
              <StyledRouterLink
                data-cy="task-spawn-host-link"
                onClick={() =>
                  taskAnalytics.sendEvent({
                    name: "Clicked metadata link",
                    "link.type": "spawn host link",
                  })
                }
                to={getSpawnHostRoute({
                  distroId,
                  spawnHost: true,
                  taskId,
                })}
              >
                Spawn host
              </StyledRouterLink>
            </MetadataItem>
          )}
        </MetadataCard>
      )}

      {dependsOn && dependsOn.length > 0 ? (
        <MetadataCard title="Depends On">
          {dependsOn.map((dep) => (
            <DependsOn
              key={`dependOnPill_${dep.taskId}`}
              buildVariant={dep.buildVariant}
              metStatus={dep.metStatus}
              name={dep.name}
              requiredStatus={dep.requiredStatus}
              taskId={dep.taskId}
            />
          ))}
        </MetadataCard>
      ) : null}

      <TagsMetadata
        failureMetadataTags={details?.failureMetadataTags}
        tags={tags}
      />
    </>
  );
};

const DurationRow = styled.div`
  font-size: 13px;
  line-height: 18px;
  margin-top: ${size.xs};

  &:not(:last-child) {
    margin-bottom: 2px;
  }
`;

const AlertBanner = styled.div<{ variant: "error" | "info" }>`
  font-size: 13px;
  line-height: 18px;
  padding: ${size.xs};
  border-radius: 4px;
  font-weight: 500;
  background-color: ${({ variant }) =>
    variant === "error" ? `${red.light3}` : `${palette.blue.light3}`};
  color: ${({ variant }) =>
    variant === "error" ? `${red.dark2}` : `${palette.blue.dark2}`};

  &:not(:last-child) {
    margin-bottom: ${size.xs};
  }
`;

const LinkGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${size.xs};
`;
