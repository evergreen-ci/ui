import { Fragment } from "react";
import styled from "@emotion/styled";
import { Badge, Variant } from "@leafygreen-ui/badge";
import { Code } from "@leafygreen-ui/code";
import { palette } from "@leafygreen-ui/palette";
import { spacing } from "@leafygreen-ui/tokens";
import {
  Body,
  Description,
  InlineCode,
  Overline,
  Subtitle,
} from "@leafygreen-ui/typography";
import { CollapsibleFinding } from "./CollapsibleFinding";
import {
  FindingSeverity,
  MergedFinding,
  MergedFindingEvent,
  MergedFindingMetric,
  MergedFindings,
  OverallStatus,
  groupFindingsBySeverity,
} from "./utils";

const severityOrder: FindingSeverity[] = ["error", "warning", "info"];

const severityConfig: Record<FindingSeverity, { label: string }> = {
  error: { label: "Error" },
  warning: { label: "Warning" },
  info: { label: "Info" },
};

const statusConfig: Record<OverallStatus, { label: string; variant: Variant }> =
  {
    success: { label: "Success", variant: Variant.Green },
    failure: { label: "Failure", variant: Variant.Red },
    partial_failure: { label: "Partial failure", variant: Variant.Yellow },
    unknown: { label: "Unknown", variant: Variant.LightGray },
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
    return emptyLabel ?? null;
  }
  if (!onLineClick) {
    return <>Line {line}</>;
  }
  return (
    <LineButton onClick={() => onLineClick(`#L${line}`)} type="button">
      Line {line}
    </LineButton>
  );
};

type FindingsSectionProps = {
  findings: MergedFinding[];
  onLineClick?: (href: string) => void;
};

const FindingsSection: React.FC<FindingsSectionProps> = ({
  findings,
  onLineClick,
}) => {
  if (findings.length === 0) return null;
  const grouped = groupFindingsBySeverity(findings);
  return (
    <Section>
      <Subtitle>Findings</Subtitle>
      {severityOrder.map((sev) =>
        grouped[sev].length > 0 ? (
          <SeverityGroup key={sev}>
            <SeverityHeading>
              {severityConfig[sev].label} ({grouped[sev].length})
            </SeverityHeading>
            <List>
              {grouped[sev].map((f) => {
                const line = (
                  <LineRef line={f.line} onLineClick={onLineClick} />
                );
                const key = `${sev}:${f.line ?? "null"}:${f.message}:${f.evidence ?? ""}`;
                if (!f.evidence) {
                  return (
                    <StaticFinding key={key}>
                      <Body weight="medium">{f.message}</Body>
                      <Description>{line}</Description>
                    </StaticFinding>
                  );
                }
                return (
                  <CollapsibleFinding key={key} line={line} message={f.message}>
                    <Code copyButtonAppearance="none" language="none">
                      {f.evidence}
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
              {ev.line !== null && (
                <Description>
                  <LineRef
                    emptyLabel={null}
                    line={ev.line}
                    onLineClick={onLineClick}
                  />
                </Description>
              )}
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
          <Fragment key={m.name}>
            <MetricName>
              <Body weight="medium">{m.name}</Body>
            </MetricName>
            <MetricValue>
              <InlineCode>{m.value}</InlineCode>
            </MetricValue>
          </Fragment>
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
          variant={statusConfig[overallStatus].variant}
        >
          {statusConfig[overallStatus].label}
        </Badge>
      </Header>

      {summary.trim() && <Body>{summary}</Body>}

      <FindingsSection findings={errors} onLineClick={onLineClick} />
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

const SeverityHeading = styled(Overline)`
  color: ${palette.gray.dark1};
`;

const LineButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: ${palette.blue.base};
  font: inherit;
  text-decoration: underline;

  &:hover {
    color: ${palette.blue.dark1};
  }

  &:focus-visible {
    outline: 2px solid ${palette.blue.base};
    outline-offset: 2px;
  }
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
