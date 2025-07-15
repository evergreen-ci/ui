import { ApolloError } from "@apollo/client";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { InlineCode } from "@leafygreen-ui/typography";
import { Link } from "react-router-dom";
import { StyledLink, StyledRouterLink } from "@evg-ui/lib/components/styles";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { shortenGithash } from "@evg-ui/lib/utils/string";
import { useTaskAnalytics } from "analytics";
import MetadataCard, {
  MetadataItem,
  MetadataLabel,
} from "components/MetadataCard";
import {
  getHoneycombTraceUrl,
  getHoneycombSystemMetricsUrl,
} from "constants/externalResources";
import {
  getDistroSettingsRoute,
  getTaskQueueRoute,
  getTaskRoute,
  getHostRoute,
  getSpawnHostRoute,
  getVersionRoute,
  getProjectPatchesRoute,
  getPodRoute,
  getImageRoute,
} from "constants/routes";
import { TaskQuery } from "gql/generated/types";
import { useDateFormat } from "hooks/useDateFormat";
import { applyStrictRegex, msToDuration } from "utils/string";
import { AbortMessage } from "./AbortMessage";
import { DependsOn } from "./DependsOn";
import DetailsDescription from "./DetailsDescription";
import ETATimer from "./ETATimer";
import RuntimeTimer from "./RuntimeTimer";
import { Stepback, isInStepback } from "./Stepback";
import TagsMetadata from "./TagsMetadata";
import TaskOwnership from "./TaskOwnership";

const { red } = palette;

interface Props {
  loading: boolean;
  task: TaskQuery["task"];
  error?: ApolloError;
}

export const Metadata: React.FC<Props> = ({ error, loading, task }) => {
  const taskAnalytics = useTaskAnalytics();
  const getDateCopy = useDateFormat();

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
    pod,
    priority,
    project,
    resetWhenFinished,
    spawnHostLink,
    startTime,
    tags,
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
  } = project || {};
  const { author, id: versionID } = versionMetadata ?? {};
  const oomTracker = details?.oomTracker;
  const taskTrace = details?.traceID;
  const diskDevices = details?.diskDevices;
  const { id: podId } = pod ?? {};
  const isContainerTask = !!podId;
  const { metadataLinks } = annotation ?? {};

  const stepback = isInStepback(task);

  return (
    <>
      <MetadataCard title="Task Metadata">
        {versionID && buildVariant && (
          <MetadataItem data-cy="task-metadata-build-variant">
            <MetadataLabel>Build Variant:</MetadataLabel>{" "}
            <StyledRouterLink
              data-cy="build-variant-link"
              onClick={() =>
                taskAnalytics.sendEvent({
                  name: "Clicked metadata link",
                  "link.type": "build variant link",
                })
              }
              to={getVersionRoute(versionID, {
                page: 0,
                variant: applyStrictRegex(buildVariant),
              })}
            >
              {buildVariantDisplayName || buildVariant}
            </StyledRouterLink>
          </MetadataItem>
        )}
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
            to={getProjectPatchesRoute(projectIdentifier || projectID || "")}
          >
            {projectIdentifier || `${owner}/${repo}`}
          </StyledRouterLink>
        </MetadataItem>
        <MetadataItem>
          <MetadataLabel>Submitted by:</MetadataLabel> {author}
        </MetadataItem>
        {ingestTime && (
          <MetadataItem data-cy="task-metadata-submitted-at">
            <MetadataLabel>Submitted at:</MetadataLabel>{" "}
            <span title={getDateCopy(ingestTime)}>
              {getDateCopy(ingestTime, { omitSeconds: true })}
            </span>
          </MetadataItem>
        )}
        {activatedTime && (
          <MetadataItem data-cy="task-metadata-activated-at">
            <MetadataLabel>Activated at:</MetadataLabel>{" "}
            <span title={getDateCopy(activatedTime)}>
              {getDateCopy(activatedTime, { omitSeconds: true })}
            </span>
          </MetadataItem>
        )}
        {generatedBy && (
          <MetadataItem>
            <MetadataLabel>Generated by:</MetadataLabel>{" "}
            <StyledRouterLink to={getTaskRoute(generatedBy)}>
              {generatedByName}
            </StyledRouterLink>
          </MetadataItem>
        )}
        {estimatedStart && estimatedStart > 0 ? (
          <MetadataItem>
            <MetadataLabel>Estimated time to start:</MetadataLabel>{" "}
            <span data-cy="task-metadata-estimated-start">
              {msToDuration(estimatedStart)}
            </span>
          </MetadataItem>
        ) : null}
        {displayStatus === TaskStatus.Started &&
        startTime &&
        expectedDuration ? (
          <ETATimer expectedDuration={expectedDuration} startTime={startTime} />
        ) : null}
        {displayStatus === TaskStatus.Started && startTime && (
          <RuntimeTimer startTime={startTime} />
        )}
        {startTime && (
          <MetadataItem>
            <MetadataLabel>Started:</MetadataLabel>{" "}
            <span
              data-cy="task-metadata-started"
              title={getDateCopy(startTime)}
            >
              {getDateCopy(startTime, { omitSeconds: true })}
            </span>
          </MetadataItem>
        )}
        {finishTime && (
          <MetadataItem>
            <MetadataLabel>Finished:</MetadataLabel>{" "}
            <span
              data-cy="task-metadata-finished"
              title={getDateCopy(finishTime)}
            >
              {getDateCopy(finishTime, { omitSeconds: true })}
            </span>
          </MetadataItem>
        )}
        {finishTime && timeTaken && timeTaken > 0 ? (
          <MetadataItem data-cy="task-metadata-duration">
            <MetadataLabel>Duration:</MetadataLabel> {msToDuration(timeTaken)}
          </MetadataItem>
        ) : null}
        {baseTaskDuration ? (
          <MetadataItem data-cy="task-metadata-base-commit-duration">
            <MetadataLabel>Base commit duration:</MetadataLabel>{" "}
            {msToDuration(baseTaskDuration)}
          </MetadataItem>
        ) : null}
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
        {(details?.description || details?.failingCommand) && (
          <DetailsDescription
            details={details}
            isContainerTask={isContainerTask}
          />
        )}

        <TaskOwnership execution={execution} taskId={taskId} />
        {details?.timeoutType && details?.timeoutType !== "" && (
          <MetadataItem>
            <MetadataLabel>Timeout type:</MetadataLabel> {details?.timeoutType}
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
        {startTime && finishTime && (
          <MetadataItem>
            <HoneycombLinkContainer>
              {taskTrace && (
                <StyledLink
                  data-cy="task-trace-link"
                  hideExternalIcon={false}
                  href={getHoneycombTraceUrl(taskTrace, startTime, finishTime)}
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
            </HoneycombLinkContainer>
          </MetadataItem>
        )}
        {stepback && <Stepback taskId={taskId} />}
      </MetadataCard>

      {!isDisplayTask && (
        <MetadataCard loading={loading} title="Host Information">
          {!isContainerTask && hostId && (
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
          {!isContainerTask && distroId && (
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
          {!isContainerTask && imageId && (
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
          {isContainerTask && (
            <MetadataItem>
              <MetadataLabel>Container:</MetadataLabel>{" "}
              <StyledLink
                data-cy="task-pod-link"
                href={getPodRoute(podId)}
                onClick={() =>
                  taskAnalytics.sendEvent({
                    name: "Clicked metadata link",
                    "link.type": "pod link",
                  })
                }
              >
                {podId}
              </StyledLink>
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

const HoneycombLinkContainer = styled.span`
  display: flex;
  flex-direction: column;
`;

const OOMTrackerMessage = styled(MetadataItem)`
  color: ${red.dark2};
  font-weight: 500;
`;
