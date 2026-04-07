import { gql } from "@apollo/client";

const PROJECT = gql`
  query Project($idOrIdentifier: String!) {
    project(projectIdentifier: $idOrIdentifier) {
      id
      identifier
    }
  }
`;

export default PROJECT;
