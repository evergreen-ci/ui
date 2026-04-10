import { gql } from "@apollo/client";

export const PROJECT_ACCESS_SETTINGS = gql`
  fragment ProjectAccessSettings on Project {
    id
    admins
    restricted
  }
`;

export const REPO_ACCESS_SETTINGS = gql`
  fragment RepoAccessSettings on RepoRef {
    id
    admins
    restricted
  }
`;
