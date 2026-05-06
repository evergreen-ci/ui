import { gql } from "@apollo/client";

export const DEFAULT_SECTION_TO_REPO = gql`
  mutation DefaultSectionToRepo(
    $projectId: String!
    $section: ProjectSettingsSection!
  ) {
    defaultSectionToRepo(opts: { projectId: $projectId, section: $section })
  }
`;
