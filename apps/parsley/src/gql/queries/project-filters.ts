import { gql } from "@apollo/client";

export const PROJECT_FILTERS = gql`
  query ProjectFilters($projectId: String!) {
    project(projectIdentifier: $projectId) {
      id
      parsleyFilters {
        caseSensitive
        description
        exactMatch
        expression
      }
    }
  }
`;
