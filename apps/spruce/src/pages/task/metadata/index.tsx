import { StyledLink, StyledRouterLink } from "@evg-ui/lib/components/styles";
import { useTaskAnalytics } from "analytics";
import MetadataCard, {
  MetadataItem,
  MetadataLabel,
  MetadataTitleWithAPILink,
} from "components/MetadataCard";
import { getAPIRouteForTasks } from "constants/externalResources";
import {
  getDistroSettingsRoute,
  getHostRoute,
  getImageRoute,
} from "constants/routes";
import { TaskQuery } from "gql/generated/types";
import { isFailedTaskStatus } from "utils/statuses";
import { BuildVariantCard } from "./BuildVariant";
import { DebugSpawnHostGuideCue } from "./DebugSpawnHostGuideCue";
import { DependsOn } from "./DependsOn";
import { ExecutionSection } from "./ExecutionSection";
import { GeneralSection } from "./GeneralSection";
import { LinksSection } from "./LinksSection";
import TagsMetadata from "./TagsMetadata";
import { TaskTimingMetadata } from "./TaskTiming";
import { TimelineSection } from "./TimelineSection";

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
    ami,
    buildId,
    buildVariant,
    buildVariantDisplayName,
    dependsOn,
    details,
    displayStatus,
    displayTask,
    distroId,
    execution,
    executionTasksFull,
    hostId,
    id: taskId,
    imageId,
    project,
    spawnHostLink,
    tags,
  } = task;

  const isDisplayTask = executionTasksFull != null;
  const { identifier: projectIdentifier } = project || {};

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
        <GeneralSection task={task} />
        <TimelineSection task={task} />
        <ExecutionSection task={task} />
        <LinksSection task={task} />
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
        <MetadataCard title="Host Information">
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
            <DebugSpawnHostGuideCue
              distroId={distroId}
              enabled={isFailedTaskStatus(displayStatus)}
              taskId={taskId}
            />
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
