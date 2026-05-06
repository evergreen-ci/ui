import { gql } from "@apollo/client";

export const PROJECT = gql`
  query Project($idOrIdentifier: String!) {
    project(projectIdentifier: $idOrIdentifier) {
      id
      identifier
    }
  }
`;
