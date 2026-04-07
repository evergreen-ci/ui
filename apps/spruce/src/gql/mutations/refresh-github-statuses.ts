import { gql } from "@apollo/client";

export const REFRESH_GITHUB_STATUSES = gql`
  mutation RefreshGithubStatuses($versionId: String!) {
    refreshGitHubStatuses(opts: { versionId: $versionId }) {
      success
    }
  }
`;
