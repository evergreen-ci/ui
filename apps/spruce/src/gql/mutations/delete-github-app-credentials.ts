import { gql } from "@apollo/client";

const DELETE_GITHUB_APP_CREDENTIALS = gql`
  mutation DeleteGithubAppCredentials($projectId: String!) {
    deleteGithubAppCredentials(opts: { projectId: $projectId }) {
      oldAppId
    }
  }
`;

export default DELETE_GITHUB_APP_CREDENTIALS;
