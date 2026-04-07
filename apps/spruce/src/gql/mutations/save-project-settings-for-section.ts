import { gql } from "@apollo/client";

const SAVE_PROJECT_SETTINGS_FOR_SECTION = gql`
  mutation SaveProjectSettingsForSection(
    $projectSettings: ProjectSettingsInput!
    $section: ProjectSettingsSection!
  ) {
    saveProjectSettingsForSection(
      projectSettings: $projectSettings
      section: $section
    ) {
      projectRef {
        id
        identifier
      }
    }
  }
`;

export default SAVE_PROJECT_SETTINGS_FOR_SECTION;
