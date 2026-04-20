import { gql } from "@apollo/client";

export const ADD_FAVORITE_PROJECT = gql`
  mutation AddFavoriteProject($projectIdentifier: String!) {
    addFavoriteProject(opts: { projectIdentifier: $projectIdentifier }) {
      id
      displayName
      identifier
      isFavorite
      owner
      repo
    }
  }
`;
