import reactStringReplace from "react-string-replace";
import { StyledLink } from "@evg-ui/lib/components";
import { getJiraTicketUrl } from "constants/externalResources";

const githubPRLinkify = (unlinkified: string | React.ReactNode[]) =>
  reactStringReplace(
    unlinkified,
    /(https:\/\/github.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+\/pull\/\d+)/g,
    (match, i) => (
      <StyledLink key={`${match}${i}`} href={match}>
        {match}
      </StyledLink>
    ),
  );

const jiraLinkify = (
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

export { githubPRLinkify, jiraLinkify };
