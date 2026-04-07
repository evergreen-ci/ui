import { gql } from "@apollo/client";

export const DELETE_GITHUB_APP_CREDENTIALS = gql`
  mutation DeleteGithubAppCredentials($projectId: String!) {
    deleteGithubAppCredentials(opts: { projectId: $projectId }) {
      oldAppId
    }
  }
`;
