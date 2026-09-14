import { gql } from "@apollo/client";

export const PROJECT_BUILD_BARON_SETTINGS_FRAGMENT = gql`
  fragment ProjectBuildBaronSettings on Project {
    id
    buildBaronSettings {
      ticketCreateProject
      ticketSearchProjects
    }
  }
`;
