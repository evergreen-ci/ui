import { gql } from "@apollo/client";

const REMOVE_FAVORITE_PROJECT = gql`
  mutation RemoveFavoriteProject($projectIdentifier: String!) {
    removeFavoriteProject(opts: { projectIdentifier: $projectIdentifier }) {
      id
      displayName
      identifier
      isFavorite
      owner
      repo
    }
  }
`;

export default REMOVE_FAVORITE_PROJECT;
