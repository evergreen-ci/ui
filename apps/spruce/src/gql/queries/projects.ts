import { gql } from "@apollo/client";

const PROJECTS = gql`
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

export default PROJECTS;
