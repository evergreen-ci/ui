import { StyledLink } from "@evg-ui/lib/components/styles";
import { getJiraSearchUrl } from "constants/externalResources";
import { BuildBaronQuery } from "gql/generated/types";
import { useSpruceConfig } from "hooks";
import { TicketsTitle } from "../BBComponents";
import JiraTicketList from "../JiraTicketList";

interface JiraIssueTableProps {
  suggestions: NonNullable<
    NonNullable<BuildBaronQuery["task"]>["buildBaronSuggestions"]
  >;
}
const JiraIssueTable: React.FC<JiraIssueTableProps> = ({ suggestions }) => {
  const spruceConfig = useSpruceConfig();
  const jiraHost = spruceConfig?.jira?.host;
  const jqlEscaped = encodeURIComponent(suggestions.search);
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const jiraSearchLink = getJiraSearchUrl(jiraHost, jqlEscaped);

  return (
    <>
      <TicketsTitle>
        Related tickets from JIRA
        <StyledLink data-testid="jira-search-link" href={jiraSearchLink}>
          {" "}
          (JIRA Search)
        </StyledLink>
      </TicketsTitle>
      {/* build baron related jira tickets */}
      <JiraTicketList jiraIssues={suggestions.issues} />
    </>
  );
};

export default JiraIssueTable;
