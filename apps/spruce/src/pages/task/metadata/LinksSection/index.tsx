import styled from "@emotion/styled";
import { StyledLink } from "@evg-ui/lib/components/styles";
import { useTaskAnalytics } from "analytics";
import { MetadataItem, MetadataSection } from "components/MetadataCard";
import {
  getHoneycombSystemMetricsUrl,
  getHoneycombTraceUrl,
} from "constants/externalResources/honeycomb";
import { TaskQuery } from "gql/generated/types";
import { isPushCompletedVirtualTask } from "utils/tasks/virtualTasks";

type Task = NonNullable<TaskQuery["task"]>;

interface LinksSectionProps {
  task: Task;
}

export const LinksSection: React.FC<LinksSectionProps> = ({ task }) => {
  const taskAnalytics = useTaskAnalytics();

  const { annotation, details, finishTime, startTime } = task;
  const metadataLinks = annotation?.metadataLinks ?? [];
  const taskTrace = details?.traceID;
  const diskDevices = details?.diskDevices ?? [];
  const hasTaskTimeRange = !!startTime && !!finishTime;
  const showTraceLink = hasTaskTimeRange && !!taskTrace;
  const showMetricsLink = hasTaskTimeRange && !isPushCompletedVirtualTask(task);

  if (metadataLinks.length === 0 && !showTraceLink && !showMetricsLink) {
    return null;
  }

  return (
    <MetadataSection title="External Links">
      {metadataLinks.map((link) => (
        <MetadataItem key={link.text}>
          <StyledLink
            data-testid="task-metadata-link"
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
      {(showTraceLink || showMetricsLink) && (
        <MetadataItem>
          <HoneycombLinkContainer>
            {showTraceLink && (
              <StyledLink
                data-testid="task-trace-link"
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
            {showMetricsLink && (
              <StyledLink
                data-testid="task-metrics-link"
                hideExternalIcon={false}
                href={getHoneycombSystemMetricsUrl(
                  task.id,
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
            )}
          </HoneycombLinkContainer>
        </MetadataItem>
      )}
    </MetadataSection>
  );
};

const HoneycombLinkContainer = styled.span`
  display: flex;
  flex-direction: column;
`;
