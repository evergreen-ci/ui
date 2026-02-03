import { StyledLink } from "@evg-ui/lib/components";
import { getJiraSearchUrl } from "constants/externalResources";
import { BuildBaron } from "gql/generated/types";
import { useSpruceConfig } from "hooks";
import { TicketsTitle } from "../BBComponents";
import JiraTicketList from "../JiraTicketList";

interface JiraIssueTableProps {
  bbData: BuildBaron;
}
const JiraIssueTable: React.FC<JiraIssueTableProps> = ({ bbData }) => {
  const spruceConfig = useSpruceConfig();
  const jiraHost = spruceConfig?.jira?.host;
  const jiraSearchString = bbData?.searchReturnInfo?.search;
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const jqlEscaped = encodeURIComponent(jiraSearchString);
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const jiraSearchLink = getJiraSearchUrl(jiraHost, jqlEscaped);

  return (
    <>
      <TicketsTitle>
        Related tickets from JIRA
        <StyledLink data-cy="jira-search-link" href={jiraSearchLink}>
          {" "}
          (JIRA Search)
        </StyledLink>
      </TicketsTitle>
      {/* build baron related jira tickets */}
      {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
      <JiraTicketList jiraIssues={bbData?.searchReturnInfo?.issues} />
    </>
  );
};

export default JiraIssueTable;
