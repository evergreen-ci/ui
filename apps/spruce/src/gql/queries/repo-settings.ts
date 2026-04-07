import { gql } from "@apollo/client";
import {
  PROJECT_SETTINGS_FIELDS,
  REPO_SETTINGS_FIELDS,
} from "../fragments/projectSettings/index";

export const REPO_SETTINGS = gql`
  query RepoSettings($repoId: String!) {
    repoSettings(repoId: $repoId) {
      ...RepoSettingsFields
    }
  }
  ${PROJECT_SETTINGS_FIELDS}
  ${REPO_SETTINGS_FIELDS}
`;
