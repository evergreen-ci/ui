import reactStringReplace from "react-string-replace";
import { StyledLink } from "components/styles";
import { getJiraTicketUrl } from "constants/externalResources";

export const jiraLinkify = (
  unlinkified: string | React.ReactNode[],
  jiraHost: string,
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  onClick?,
) =>
  reactStringReplace(unlinkified, /([A-Z]{1,10}-\d{1,6})/g, (match, i) => (
    <StyledLink
      key={`${match}${i}`}
      data-cy="jira-link"
      href={getJiraTicketUrl(jiraHost, match)}
      onClick={onClick}
    >
      {match}
    </StyledLink>
  ));
