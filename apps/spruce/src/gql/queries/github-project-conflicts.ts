import { gql } from "@apollo/client";

export const GITHUB_PROJECT_CONFLICTS = gql`
  query GithubProjectConflicts($projectId: String!) {
    githubProjectConflicts(projectId: $projectId) {
      commitCheckIdentifiers
      commitQueueIdentifiers
      prTestingIdentifiers
    }
  }
`;
