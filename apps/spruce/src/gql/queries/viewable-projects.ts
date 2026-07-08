import { gql } from "@apollo/client";

export const VIEWABLE_PROJECTS = gql`
  query ViewableProjectRefs {
    viewableProjectRefs {
      groupDisplayName
      projects {
        id
        displayName
        enabled
        identifier
        isFavorite
        owner
        repo
      }
      repo {
        id
      }
    }
  }
`;
