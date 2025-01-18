import { useRef } from "react";
import { ApolloError } from "@apollo/client";
import styled from "@emotion/styled";
import {
  Chip,
  Variant as ChipVariant,
  TruncationLocation,
} from "@leafygreen-ui/chip";
import { palette } from "@leafygreen-ui/palette";
import { InlineCode } from "@leafygreen-ui/typography";
import { Link } from "react-router-dom";
import { StyledLink, StyledRouterLink } from "@evg-ui/lib/components/styles";
import { size, zIndex } from "@evg-ui/lib/constants/tokens";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { useTaskAnalytics } from "analytics";
import ExpandedText from "components/ExpandedText";
import {
  MetadataCard,
  MetadataItem,
  MetadataTitle,
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
import { useDateFormat } from "hooks";
import { string } from "utils";
import { isFailedTaskStatus } from "utils/statuses";
import { AbortMessage } from "./AbortMessage";
import { DependsOn } from "./DependsOn";
import ETATimer from "./ETATimer";
import { ImageVisibilityGuideCue } from "./ImageVisibilityGuideCue";
import RuntimeTimer from "./RuntimeTimer";
import { Stepback, isInStepback } from "./Stepback";

const { applyStrictRegex, msToDuration, shortenGithash } = string;
const { red } = palette;

interface Props {
  taskId: string;
  loading: boolean;
  task: TaskQuery["task"];
  error: ApolloError | null;
}

export const Metadata: React.FC<Props> = ({ error, loading, task, taskId }) => {
  const taskAnalytics = useTaskAnalytics();
  const getDateCopy = useDateFormat();
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
    executionTasksFull,
    expectedDuration,
    finishTime,
    generatedBy,
    generatedByName,
    hostId,
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
  } = task || {};

  const submittedTime = activatedTime ?? ingestTime;
  const isDisplayTask = executionTasksFull != null;
  const {
    id: baseTaskId,
    timeTaken: baseTaskDuration,
    versionMetadata: baseTaskVersionMetadata,
  } = baseTask ?? {};
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const baseCommit = shortenGithash(baseTaskVersionMetadata?.revision);
  const projectIdentifier = project?.identifier;
  const { author, id: versionID } = versionMetadata ?? {};
  const oomTracker = details?.oomTracker;
  const taskTrace = details?.traceID;
  const diskDevices = details?.diskDevices;
  const { id: podId } = pod ?? {};
  const isContainerTask = !!podId;
  const { metadataLinks } = annotation ?? {};

  const stepback = isInStepback(task);

  const imageVisibilityGuideCueTriggerRef = useRef<HTMLAnchorElement>(null);

  return (
    <>
      <MetadataCard
        error={!task && error ? error : undefined}
        loading={loading}
      >
        <MetadataTitle>Task Metadata</MetadataTitle>
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
        {projectIdentifier && (
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
              to={getProjectPatchesRoute(projectIdentifier)}
            >
              {projectIdentifier}
            </StyledRouterLink>
          </MetadataItem>
        )}
        <MetadataItem>
          <MetadataLabel>Submitted by:</MetadataLabel> {author}
        </MetadataItem>
        {submittedTime && (
          <MetadataItem data-cy="task-metadata-submitted-at">
            <MetadataLabel>Submitted at:</MetadataLabel>{" "}
            <span title={getDateCopy(submittedTime)}>
              {getDateCopy(submittedTime, { omitSeconds: true })}
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
              as={Link}
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
            description={details?.description ?? ""}
            failingCommand={details?.failingCommand ?? ""}
            isContainerTask={isContainerTask}
            status={details?.status}
          />
        )}
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
              // @ts-expect-error: FIXME. This comment was added by an automated script.
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
        {taskTrace && startTime && finishTime && (
          <MetadataItem>
            <HoneycombLinkContainer>
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
        <MetadataCard>
          <MetadataTitle>Host Information</MetadataTitle>{" "}
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
              <ImageVisibilityGuideCue
                refEl={imageVisibilityGuideCueTriggerRef}
              />
              <MetadataLabel>Image:</MetadataLabel>{" "}
              <StyledRouterLink
                ref={imageVisibilityGuideCueTriggerRef}
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
        <MetadataCard>
          <MetadataTitle>Depends On</MetadataTitle>
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

      {tags && tags.length > 0 ? (
        <MetadataCard>
          <MetadataTitle>Tags</MetadataTitle>
          <TagsContainer>
            {tags.map((t) => (
              <Chip
                key={`task-tag-${t}`}
                chipCharacterLimit={30}
                chipTruncationLocation={TruncationLocation.End}
                label={t}
                variant={ChipVariant.Gray}
              />
            ))}
          </TagsContainer>
        </MetadataCard>
      ) : null}
    </>
  );
};

const DetailsDescription = ({
  description,
  failingCommand,
  isContainerTask,
  status,
}: {
  description: string;
  failingCommand: string;
  isContainerTask: boolean;
  status: string;
}) => {
  const MAX_CHAR = 100;
  const isFailingTask = isFailedTaskStatus(status);
  const baseCopy = description || failingCommand;
  const fullText = isFailingTask
    ? `${processFailingCommand(baseCopy, isContainerTask)}`
    : `${baseCopy}`;

  const shouldTruncate = fullText.length > MAX_CHAR;
  const truncatedText = fullText.substring(0, MAX_CHAR).concat("...");

  return (
    <MetadataItem data-cy="task-metadata-description">
      {isFailingTask ? (
        <MetadataLabel color={red.base}>Failing Command: </MetadataLabel>
      ) : (
        <MetadataLabel>Command: </MetadataLabel>
      )}
      {shouldTruncate ? (
        <>
          {truncatedText}{" "}
          <ExpandedText
            align="right"
            data-cy="task-metadata-description-tooltip"
            justify="end"
            message={description}
            popoverZIndex={zIndex.tooltip}
          />
        </>
      ) : (
        fullText
      )}
    </MetadataItem>
  );
};

const processFailingCommand = (
  description: string,
  isContainerTask: boolean,
): string => {
  if (description === "stranded") {
    return isContainerTask
      ? containerTaskStrandedMessage
      : hostTaskStrandedMessage;
  }
  return description;
};

const containerTaskStrandedMessage =
  "Task failed because the container was stranded by the ECS agent.";
const hostTaskStrandedMessage =
  "Task failed because spot host was unexpectedly terminated by AWS.";

const HoneycombLinkContainer = styled.span`
  display: flex;
  flex-direction: column;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${size.xs};
`;

const OOMTrackerMessage = styled(MetadataItem)`
  color: ${red.dark2};
  font-weight: 500;
`;
