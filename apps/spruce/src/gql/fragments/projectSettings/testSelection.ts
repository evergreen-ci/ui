import { gql } from "@apollo/client";

export const PROJECT_TEST_SELECTION_SETTINGS = gql`
  fragment ProjectTestSelectionSettings on Project {
    id
    testSelection {
      allowed
      defaultEnabled
    }
  }
`;

export const REPO_TEST_SELECTION_SETTINGS = gql`
  fragment RepoTestSelectionSettings on RepoRef {
    id
    testSelection {
      allowed
      defaultEnabled
    }
  }
`;
