import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { spacing } from "@leafygreen-ui/tokens";
import {
  FindingSeverity,
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

const severityColors: Record<
  FindingSeverity,
  { background: string; border: string; text: string }
> = {
  error: {
    background: palette.red.light3,
    border: palette.red.base,
    text: palette.red.dark2,
  },
  warning: {
    background: palette.yellow.light3,
    border: palette.yellow.dark2,
    text: palette.yellow.dark2,
  },
  info: {
    background: palette.blue.light3,
    border: palette.blue.base,
    text: palette.blue.dark2,
  },
};

const statusLabel: Record<OverallStatus, string> = {
  success: "Success",
  failure: "Failure",
  partial_failure: "Partial failure",
  unknown: "Unknown",
};

const statusColors: Record<
  OverallStatus,
  { background: string; border: string; text: string }
> = {
  success: {
    background: palette.green.light3,
    border: palette.green.dark1,
    text: palette.green.dark2,
  },
  failure: {
    background: palette.red.light3,
    border: palette.red.base,
    text: palette.red.dark2,
  },
  partial_failure: {
    background: palette.yellow.light3,
    border: palette.yellow.dark2,
    text: palette.yellow.dark2,
  },
  unknown: {
    background: palette.gray.light3,
    border: palette.gray.base,
    text: palette.gray.dark2,
  },
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
    return emptyLabel ? <Muted>{emptyLabel}</Muted> : null;
  }
  if (!onLineClick) {
    return <>Line {line}</>;
  }
  return (
    <LineLink
      href={`#L${line}`}
      onClick={(e) => {
        e.preventDefault();
        onLineClick(`#L${line}`);
      }}
    >
      Line {line}
    </LineLink>
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
  const grouped = groupErrorsBySeverity(errors);

  return (
    <Container>
      <Header>
        <StatusBadge
          data-cy="merged-findings-status"
          data-status={overallStatus}
          style={{
            backgroundColor: statusColors[overallStatus].background,
            borderColor: statusColors[overallStatus].border,
            color: statusColors[overallStatus].text,
          }}
        >
          {statusLabel[overallStatus]}
        </StatusBadge>
      </Header>

      {summary && <Summary>{summary}</Summary>}

      {errors.length > 0 && (
        <Section>
          <SectionTitle>Findings</SectionTitle>
          {severityOrder.map((sev) =>
            grouped[sev].length > 0 ? (
              <SeverityGroup key={sev}>
                <SeverityHeading>
                  {severityLabel[sev]} ({grouped[sev].length})
                </SeverityHeading>
                <List>
                  {grouped[sev].map((err) => (
                    <FindingItem
                      key={`${sev}:${err.line ?? "null"}:${err.message}`}
                    >
                      <FindingHeader>
                        <SeverityBadge
                          style={{
                            backgroundColor: severityColors[sev].background,
                            borderColor: severityColors[sev].border,
                            color: severityColors[sev].text,
                          }}
                        >
                          {severityLabel[sev]}
                        </SeverityBadge>
                        <FindingMessage>{err.message}</FindingMessage>
                      </FindingHeader>
                      <FindingMeta>
                        <LineRef line={err.line} onLineClick={onLineClick} />
                      </FindingMeta>
                      {err.evidence && <Evidence>{err.evidence}</Evidence>}
                    </FindingItem>
                  ))}
                </List>
              </SeverityGroup>
            ) : null,
          )}
        </Section>
      )}

      {events.length > 0 && (
        <Section>
          <SectionTitle>Events</SectionTitle>
          <Timeline>
            {events.map((ev) => (
              <TimelineItem
                key={`${ev.timestamp ?? "null"}:${ev.line ?? "null"}:${ev.description}`}
              >
                <TimelineMeta>
                  {ev.timestamp ? (
                    <Timestamp>{ev.timestamp}</Timestamp>
                  ) : (
                    <Muted>No timestamp</Muted>
                  )}
                  <LineRef
                    emptyLabel={null}
                    line={ev.line}
                    onLineClick={onLineClick}
                  />
                </TimelineMeta>
                <TimelineDescription>{ev.description}</TimelineDescription>
              </TimelineItem>
            ))}
          </Timeline>
        </Section>
      )}

      {metrics.length > 0 && (
        <Section>
          <SectionTitle>Metrics</SectionTitle>
          <MetricsList>
            {metrics.map((m) => (
              <MetricRow key={`${m.name}:${m.value}`}>
                <MetricName>{m.name}</MetricName>
                <MetricValue>{m.value}</MetricValue>
              </MetricRow>
            ))}
          </MetricsList>
        </Section>
      )}

      {observations.length > 0 && (
        <Section>
          <SectionTitle>Observations</SectionTitle>
          <Bulleted>
            {observations.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </Bulleted>
        </Section>
      )}
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

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: ${spacing[50]}px ${spacing[150]}px;
  border-radius: 12px;
  border: 1px solid;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Summary = styled.p`
  margin: 0;
  color: ${palette.gray.dark2};
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${spacing[100]}px;
`;

const SectionTitle = styled.h4`
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: ${palette.gray.dark2};
`;

const SeverityGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[50]}px;
`;

const SeverityHeading = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${palette.gray.dark1};
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${spacing[100]}px;
`;

const FindingItem = styled.li`
  border: 1px solid ${palette.gray.light2};
  border-radius: 4px;
  padding: ${spacing[150]}px;
  display: flex;
  flex-direction: column;
  gap: ${spacing[50]}px;
`;

const FindingHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[150]}px;
`;

const SeverityBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px ${spacing[100]}px;
  border-radius: 10px;
  border: 1px solid;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  flex-shrink: 0;
`;

const FindingMessage = styled.span`
  font-weight: 500;
`;

const FindingMeta = styled.div`
  font-size: 12px;
  color: ${palette.gray.dark1};
`;

const LineLink = styled.a`
  color: ${palette.blue.base};
  cursor: pointer;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const Muted = styled.span`
  color: ${palette.gray.base};
  font-style: italic;
`;

const Evidence = styled.pre`
  margin: 0;
  padding: ${spacing[100]}px;
  background-color: ${palette.gray.light3};
  border-radius: 3px;
  font-size: 12px;
  white-space: pre-wrap;
  word-break: break-word;
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
  gap: ${spacing[150]}px;
  font-size: 12px;
  color: ${palette.gray.dark1};
`;

const Timestamp = styled.span`
  font-family: monospace;
`;

const TimelineDescription = styled.div``;

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
  font-weight: 600;
  color: ${palette.gray.dark1};
`;

const MetricValue = styled.dd`
  margin: 0;
  font-family: monospace;
`;

const Bulleted = styled.ul`
  margin: 0;
  padding-left: ${spacing[400]}px;
  display: flex;
  flex-direction: column;
  gap: ${spacing[50]}px;
`;
