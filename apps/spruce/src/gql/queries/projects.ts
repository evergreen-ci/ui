import { gql } from "@apollo/client";

export const PROJECTS = gql`
  query Projects {
    projects {
      groupDisplayName
      projects {
        id
        displayName
        identifier
        isFavorite
        owner
        repo
      }
    }
  }
`;
