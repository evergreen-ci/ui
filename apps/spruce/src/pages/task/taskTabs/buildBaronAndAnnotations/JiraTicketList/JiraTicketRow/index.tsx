import styled from "@emotion/styled";
import { Badge } from "@leafygreen-ui/badge";
import { Disclaimer } from "@leafygreen-ui/typography";
import { StyledLink } from "@evg-ui/lib/components/styles";
import { size } from "@evg-ui/lib/constants/tokens";
import { trimStringFromMiddle } from "@evg-ui/lib/utils/string";
import { useAnnotationAnalytics } from "analytics";
import { getJiraTicketUrl } from "constants/externalResources";
import { TicketFields } from "gql/generated/types";
import { useSpruceConfig, useDateFormat } from "hooks";

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
    <Container data-cy="jira-ticket-row">
      <JiraSummaryLink
        data-cy={jiraKey}
        href={url}
        onClick={() =>
          annotationAnalytics.sendEvent({
            name: "Clicked Jira ticket summary link",
          })
        }
        title={summary}
      >
        {jiraKey}: {trimStringFromMiddle(summary, 80)}
      </JiraSummaryLink>

      <Badge data-cy={`${jiraKey}-badge`} variant="lightgray">
        {status.name}
      </Badge>

      <BottomMetaDataWrapper data-cy={`${jiraKey}-metadata`}>
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
      </BottomMetaDataWrapper>
    </Container>
  );
};

const Container = styled.div`
  padding: ${size.xs};
`;
const BottomMetaDataWrapper = styled.div`
  margin-top: ${size.xs};
  display: flex;
  gap: ${size.s};
`;

const JiraSummaryLink = styled(StyledLink)`
  font-weight: bold;
  margin-right: ${size.s};
`;

export default JiraTicketRow;
