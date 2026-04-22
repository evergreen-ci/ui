import styled from "@emotion/styled";
import { Badge, Variant } from "@leafygreen-ui/badge";
import { Code } from "@leafygreen-ui/code";
import { palette } from "@leafygreen-ui/palette";
import { spacing } from "@leafygreen-ui/tokens";
import {
  Body,
  Description,
  InlineCode,
  Link,
  Subtitle,
} from "@leafygreen-ui/typography";
import { CollapsibleFinding } from "./CollapsibleFinding";
import {
  FindingSeverity,
  MergedFindingError,
  MergedFindingEvent,
  MergedFindingMetric,
  MergedFindings,
  OverallStatus,
  groupErrorsBySeverity,
} from "./utils";

const severityOrder: FindingSeverity[] = ["error", "warning", "info"];

const severityLabel: Record<FindingSeverity, string> = {
  error: "Error",
  warning: "Warning",
  info: "Info",
};

const statusLabel: Record<OverallStatus, string> = {
  success: "Success",
  failure: "Failure",
  partial_failure: "Partial failure",
  unknown: "Unknown",
};

const statusVariant: Record<OverallStatus, Variant> = {
  success: Variant.Green,
  failure: Variant.Red,
  partial_failure: Variant.Yellow,
  unknown: Variant.LightGray,
};

type LineRefProps = {
  emptyLabel?: string | null;
  line: number | null;
  onLineClick?: (href: string) => void;
};

const LineRef: React.FC<LineRefProps> = ({
  emptyLabel = "No line",
  line,
  onLineClick,
}) => {
  if (line === null) {
    return emptyLabel ? <Description>{emptyLabel}</Description> : null;
  }
  if (!onLineClick) {
    return <>Line {line}</>;
  }
  return (
    <Link
      hideExternalIcon
      href={`#L${line}`}
      onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        onLineClick(`#L${line}`);
      }}
    >
      Line {line}
    </Link>
  );
};

type FindingsSectionProps = {
  errors: MergedFindingError[];
  onLineClick?: (href: string) => void;
};

const FindingsSection: React.FC<FindingsSectionProps> = ({
  errors,
  onLineClick,
}) => {
  if (errors.length === 0) return null;
  const grouped = groupErrorsBySeverity(errors);
  return (
    <Section>
      <Subtitle>Findings</Subtitle>
      {severityOrder.map((sev) =>
        grouped[sev].length > 0 ? (
          <SeverityGroup key={sev}>
            <SeverityHeading>
              {severityLabel[sev]} ({grouped[sev].length})
            </SeverityHeading>
            <List>
              {grouped[sev].map((err) => {
                const line = (
                  <LineRef line={err.line} onLineClick={onLineClick} />
                );
                if (!err.evidence) {
                  return (
                    <StaticFinding
                      key={`${sev}:${err.line ?? "null"}:${err.message}`}
                    >
                      <Body weight="medium">{err.message}</Body>
                      <Description>{line}</Description>
                    </StaticFinding>
                  );
                }
                return (
                  <CollapsibleFinding
                    key={`${sev}:${err.line ?? "null"}:${err.message}`}
                    line={line}
                    message={err.message}
                  >
                    <Code copyButtonAppearance="none" language="none">
                      {err.evidence}
                    </Code>
                  </CollapsibleFinding>
                );
              })}
            </List>
          </SeverityGroup>
        ) : null,
      )}
    </Section>
  );
};

type EventsSectionProps = {
  events: MergedFindingEvent[];
  onLineClick?: (href: string) => void;
};

const EventsSection: React.FC<EventsSectionProps> = ({
  events,
  onLineClick,
}) => {
  if (events.length === 0) return null;
  return (
    <Section>
      <Subtitle>Events</Subtitle>
      <Timeline>
        {events.map((ev) => (
          <TimelineItem
            key={`${ev.timestamp ?? "null"}:${ev.line ?? "null"}:${ev.description}`}
          >
            <TimelineMeta>
              {ev.timestamp ? (
                <InlineCode>{ev.timestamp}</InlineCode>
              ) : (
                <Description>No timestamp</Description>
              )}
              <Description>
                <LineRef
                  emptyLabel={null}
                  line={ev.line}
                  onLineClick={onLineClick}
                />
              </Description>
            </TimelineMeta>
            <Body>{ev.description}</Body>
          </TimelineItem>
        ))}
      </Timeline>
    </Section>
  );
};

type MetricsSectionProps = {
  metrics: MergedFindingMetric[];
};

const MetricsSection: React.FC<MetricsSectionProps> = ({ metrics }) => {
  if (metrics.length === 0) return null;
  return (
    <Section>
      <Subtitle>Metrics</Subtitle>
      <MetricsList>
        {metrics.map((m) => (
          <MetricRow key={`${m.name}:${m.value}`}>
            <MetricName>
              <Body weight="medium">{m.name}</Body>
            </MetricName>
            <MetricValue>
              <InlineCode>{m.value}</InlineCode>
            </MetricValue>
          </MetricRow>
        ))}
      </MetricsList>
    </Section>
  );
};

type ObservationsSectionProps = {
  observations: string[];
};

const ObservationsSection: React.FC<ObservationsSectionProps> = ({
  observations,
}) => {
  if (observations.length === 0) return null;
  return (
    <Section>
      <Subtitle>Observations</Subtitle>
      <Bulleted>
        {observations.map((o) => (
          <li key={o}>
            <Body>{o}</Body>
          </li>
        ))}
      </Bulleted>
    </Section>
  );
};

type MergedFindingsViewProps = {
  findings: MergedFindings;
  onLineClick?: (href: string) => void;
};

export const MergedFindingsView: React.FC<MergedFindingsViewProps> = ({
  findings,
  onLineClick,
}) => {
  const { errors, events, metrics, observations, overallStatus, summary } =
    findings;

  return (
    <Container>
      <Header>
        <Badge
          data-cy="merged-findings-status"
          data-status={overallStatus}
          variant={statusVariant[overallStatus]}
        >
          {statusLabel[overallStatus]}
        </Badge>
      </Header>

      {summary && <Body>{summary}</Body>}

      <FindingsSection errors={errors} onLineClick={onLineClick} />
      <EventsSection events={events} onLineClick={onLineClick} />
      <MetricsSection metrics={metrics} />
      <ObservationsSection observations={observations} />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[200]}px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[200]}px;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${spacing[100]}px;
`;

const SeverityGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[50]}px;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${spacing[100]}px;
`;

const SeverityHeading = styled.div`
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  color: ${palette.gray.dark1};
`;

const StaticFinding = styled.li`
  padding: ${spacing[150]}px;
  border: 1px solid ${palette.gray.light2};
  border-radius: 4px;
`;

const Timeline = styled.ol`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${spacing[100]}px;
`;

const TimelineItem = styled.li`
  display: flex;
  flex-direction: column;
  gap: ${spacing[50]}px;
  padding-left: ${spacing[200]}px;
  border-left: 2px solid ${palette.gray.light2};
`;

const TimelineMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[150]}px;
`;

const MetricsList = styled.dl`
  margin: 0;
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: ${spacing[50]}px ${spacing[200]}px;
`;

const MetricRow = styled.div`
  display: contents;
`;

const MetricName = styled.dt`
  margin: 0;
`;

const MetricValue = styled.dd`
  margin: 0;
`;

const Bulleted = styled.ul`
  margin: 0;
  padding-left: ${spacing[400]}px;
  display: flex;
  flex-direction: column;
  gap: ${spacing[50]}px;
`;
