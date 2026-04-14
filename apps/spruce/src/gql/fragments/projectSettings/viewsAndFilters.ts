import { gql } from "@apollo/client";

export const PROJECT_VIEWS_AND_FILTERS_SETTINGS = gql`
  fragment ProjectViewsAndFiltersSettings on Project {
    id
    parsleyFilters {
      caseSensitive
      description
      exactMatch
      expression
    }
  }
`;

export const REPO_VIEWS_AND_FILTERS_SETTINGS = gql`
  fragment RepoViewsAndFiltersSettings on RepoRef {
    id
    parsleyFilters {
      caseSensitive
      description
      exactMatch
      expression
    }
  }
`;
