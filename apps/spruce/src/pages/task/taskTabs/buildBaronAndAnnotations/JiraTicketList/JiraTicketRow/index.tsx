import { Badge } from "@leafygreen-ui/badge";
import { Disclaimer } from "@leafygreen-ui/typography";
import { StyledLink } from "@evg-ui/lib/components/styles";
import { trimStringFromMiddle } from "@evg-ui/lib/utils/string";
import { useAnnotationAnalytics } from "analytics";
import { getJiraTicketUrl } from "constants/externalResources";
import { TicketFields } from "gql/generated/types";
import { useDateFormat, useSpruceConfig } from "hooks";
import styles from "./index.module.css";

interface JiraTicketRowProps {
  jiraKey: string;
  fields: TicketFields;
}
const JiraTicketRow: React.FC<JiraTicketRowProps> = ({ fields, jiraKey }) => {
  const annotationAnalytics = useAnnotationAnalytics();
  const getDateCopy = useDateFormat();
  const spruceConfig = useSpruceConfig();
  const jiraHost = spruceConfig?.jira?.host;
  const url = getJiraTicketUrl(jiraHost || "", jiraKey);
  const { assigneeDisplayName, created, status, summary, updated } =
    fields ?? {};
  return (
    <div className={styles.container} data-testid="jira-ticket-row">
      <StyledLink
        className={styles.jiraSummaryLink}
        data-testid={jiraKey}
        href={url}
        onClick={() =>
          annotationAnalytics.sendEvent({
            name: "Clicked Jira ticket summary link",
          })
        }
        title={summary}
      >
        {jiraKey}: {trimStringFromMiddle(summary, 80)}
      </StyledLink>

      <Badge data-testid={`${jiraKey}-badge`} variant="lightgray">
        {status.name}
      </Badge>

      <div
        className={styles.bottomMetadataWrapper}
        data-testid={`${jiraKey}-metadata`}
      >
        <Disclaimer>
          Created: {getDateCopy(created, { dateOnly: true })}
        </Disclaimer>
        <Disclaimer>
          Updated: {getDateCopy(updated, { dateOnly: true })}
        </Disclaimer>
        <Disclaimer>
          {assigneeDisplayName
            ? `Assignee: ${assigneeDisplayName}`
            : "Unassigned"}
        </Disclaimer>
      </div>
    </div>
  );
};

export default JiraTicketRow;
