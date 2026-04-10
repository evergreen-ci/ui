import { gql } from "@apollo/client";

export const PROJECT_BANNER = gql`
  query ProjectBanner($identifier: String!) {
    project(projectIdentifier: $identifier) {
      id
      banner {
        text
        theme
      }
    }
  }
`;
