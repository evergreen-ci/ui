import { gql } from "@apollo/client";

const PROJECT_BANNER = gql`
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

export default PROJECT_BANNER;
