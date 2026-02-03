import styled from "@emotion/styled";
import { Badge } from "@leafygreen-ui/badge";
import { Skeleton } from "@leafygreen-ui/skeleton-loader";
import { Disclaimer } from "@leafygreen-ui/typography";
import { StyledLink } from "@evg-ui/lib/components";
import { size } from "@evg-ui/lib/constants";
import { useAnnotationAnalytics } from "analytics";
import { JiraTicket } from "gql/generated/types";
import { useDateFormat } from "hooks";
import { numbers } from "utils";

const { roundDecimal, toPercent } = numbers;

interface AnnotationTicketRowProps {
  issueKey?: string;
  url?: string;
  jiraTicket?: JiraTicket;
  loading?: boolean;
  confidenceScore?: number;
}

const AnnotationTicketRow: React.FC<AnnotationTicketRowProps> = ({
  confidenceScore,
  issueKey,
  jiraTicket,
  loading = false,
  url,
}) => {
  const getDateCopy = useDateFormat();
  const annotationAnalytics = useAnnotationAnalytics();
  const fields = jiraTicket?.fields;
  const {
    assignedTeam,
    assigneeDisplayName,
    created,
    status,
    summary,
    updated,
  } = fields ?? {};

  const jiraLink = (
    <JiraSummaryLink
      data-cy={issueKey}
      href={url ?? ""}
      onClick={() =>
        annotationAnalytics.sendEvent({
          name: "Clicked annotation link",
          target: "Jira ticket link",
        })
      }
      target="_blank"
    >
      {issueKey}
      {summary && `: ${summary}`}
    </JiraSummaryLink>
  );
  return (
    <Container data-cy="annotation-ticket-row">
      {loading ? (
        <>
          {jiraLink}
          <Skeleton data-cy="loading-annotation-ticket" />
        </>
      ) : (
        <>
          {jiraLink}
          {jiraTicket && (
            <StyledBadge data-cy={`${issueKey}-badge`} variant="lightgray">
              {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
              {status.name}
            </StyledBadge>
          )}
          {confidenceScore !== undefined && (
            <StyledBadge
              data-cy={`${issueKey}-confidence-badge`}
              variant="blue"
            >
              {roundDecimal(toPercent(confidenceScore), 2)}% Confident in
              suggestion
            </StyledBadge>
          )}
          <BottomMetaDataWrapper data-cy={`${issueKey}-metadata`}>
            {created && (
              <Disclaimer>
                Created: {getDateCopy(created, { dateOnly: true })}
              </Disclaimer>
            )}
            {updated && (
              <Disclaimer>
                Updated: {getDateCopy(updated, { dateOnly: true })}
              </Disclaimer>
            )}
            <Disclaimer>
              {assigneeDisplayName
                ? `Assignee: ${assigneeDisplayName}`
                : `Unassigned`}
            </Disclaimer>
            {assignedTeam && (
              <Disclaimer>Assigned Team: {assignedTeam}</Disclaimer>
            )}
          </BottomMetaDataWrapper>
        </>
      )}
    </Container>
  );
};
const Container = styled.div`
  width: 100%;
`;

const JiraSummaryLink = styled(StyledLink)`
  font-weight: bold;
  margin-right: ${size.s};
`;

const StyledBadge = styled(Badge)`
  margin-right: ${size.s};
`;

const BottomMetaDataWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${size.xs};
  width: 80%;
`;

export default AnnotationTicketRow;
export type { AnnotationTicketRowProps };
