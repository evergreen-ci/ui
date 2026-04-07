import { gql } from "@apollo/client";

const PROJECT_FILTERS = gql`
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

export default PROJECT_FILTERS;
