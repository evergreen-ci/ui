import { gql } from "@apollo/client";
import { REPO_SETTINGS_FIELDS } from "../fragments/projectSettings/index";

export const REPO_SETTINGS = gql`
  query RepoSettings($repoId: String!) {
    repoSettings(repoId: $repoId) {
      ...RepoSettingsFields
    }
  }
  ${REPO_SETTINGS_FIELDS}
`;
