import { gql } from "@apollo/client";

const DEFAULT_SECTION_TO_REPO = gql`
  mutation DefaultSectionToRepo(
    $projectId: String!
    $section: ProjectSettingsSection!
  ) {
    defaultSectionToRepo(opts: { projectId: $projectId, section: $section })
  }
`;

export default DEFAULT_SECTION_TO_REPO;
