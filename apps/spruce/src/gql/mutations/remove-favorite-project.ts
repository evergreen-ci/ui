import { gql } from "@apollo/client";

export const REMOVE_FAVORITE_PROJECT = gql`
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
