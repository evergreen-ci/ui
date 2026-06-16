import styled from "@emotion/styled";
import { StyledLink } from "@evg-ui/lib/components/styles";
import { useTaskAnalytics } from "analytics";
import { MetadataHeader, MetadataItem } from "components/MetadataCard";
import {
  getHoneycombSystemMetricsUrl,
  getHoneycombTraceUrl,
} from "constants/externalResources/honeycomb";
import { TaskQuery } from "gql/generated/types";

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

  const hasContent = metadataLinks?.length || (startTime && finishTime);

  return hasContent ? (
    <>
      <MetadataHeader title="Links" />
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
          </HoneycombLinkContainer>
        </MetadataItem>
      )}
    </>
  ) : null;
};

const HoneycombLinkContainer = styled.span`
  display: flex;
  flex-direction: column;
`;
