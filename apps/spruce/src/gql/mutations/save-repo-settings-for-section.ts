import { gql } from "@apollo/client";

export const SAVE_REPO_SETTINGS_FOR_SECTION = gql`
  mutation SaveRepoSettingsForSection(
    $repoSettings: RepoSettingsInput!
    $section: ProjectSettingsSection!
  ) {
    saveRepoSettingsForSection(repoSettings: $repoSettings, section: $section) {
      projectRef {
        id
      }
    }
  }
`;
