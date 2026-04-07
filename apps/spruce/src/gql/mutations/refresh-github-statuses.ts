import { gql } from "@apollo/client";

const REFRESH_GITHUB_STATUSES = gql`
  mutation RefreshGithubStatuses($versionId: String!) {
    refreshGitHubStatuses(opts: { versionId: $versionId }) {
      success
    }
  }
`;

export default REFRESH_GITHUB_STATUSES;
