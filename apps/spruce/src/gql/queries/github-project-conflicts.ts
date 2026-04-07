import { gql } from "@apollo/client";

const GITHUB_PROJECT_CONFLICTS = gql`
  query GithubProjectConflicts($projectId: String!) {
    githubProjectConflicts(projectId: $projectId) {
      commitCheckIdentifiers
      commitQueueIdentifiers
      prTestingIdentifiers
    }
  }
`;

export default GITHUB_PROJECT_CONFLICTS;
