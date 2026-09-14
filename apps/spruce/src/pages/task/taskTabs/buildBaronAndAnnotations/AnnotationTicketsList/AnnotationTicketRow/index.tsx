import { Badge } from "@leafygreen-ui/badge";
import { Skeleton } from "@leafygreen-ui/skeleton-loader";
import { Disclaimer } from "@leafygreen-ui/typography";
import { StyledLink } from "@evg-ui/lib/components/styles";
import { isValidHttpUrl } from "@evg-ui/lib/utils/url";
import { useAnnotationAnalytics } from "analytics";
import { JiraTicket } from "gql/generated/types";
import { useDateFormat } from "hooks";
import { numbers } from "utils";
import styles from "./index.module.css";

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

  const summaryText = (
    <>
      {issueKey}
      {summary && `: ${summary}`}
    </>
  );

  const jiraLink = isValidHttpUrl(url) ? (
    <StyledLink
      className={styles.jiraSummaryLink}
      data-testid={issueKey}
      href={url}
      onClick={() =>
        annotationAnalytics.sendEvent({
          name: "Clicked annotation link",
          target: "Jira ticket link",
        })
      }
      target="_blank"
    >
      {summaryText}
    </StyledLink>
  ) : (
    <span className={styles.unlinkedJiraSummary} data-testid={issueKey}>
      {summaryText}
    </span>
  );

  return (
    <div className={styles.container} data-testid="annotation-ticket-row">
      {loading ? (
        <>
          {jiraLink}
          <Skeleton data-testid="loading-annotation-ticket" />
        </>
      ) : (
        <>
          {jiraLink}
          {jiraTicket && (
            <Badge
              className={styles.badge}
              data-testid={`${issueKey}-badge`}
              variant="lightgray"
            >
              {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
              {status.name}
            </Badge>
          )}
          {confidenceScore !== undefined && (
            <Badge
              className={styles.badge}
              data-testid={`${issueKey}-confidence-badge`}
              variant="blue"
            >
              {roundDecimal(toPercent(confidenceScore), 2)}% Confident in
              suggestion
            </Badge>
          )}
          <div
            className={styles.bottomMetadataWrapper}
            data-testid={`${issueKey}-metadata`}
          >
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
          </div>
        </>
      )}
    </div>
  );
};

export default AnnotationTicketRow;
export type { AnnotationTicketRowProps };
