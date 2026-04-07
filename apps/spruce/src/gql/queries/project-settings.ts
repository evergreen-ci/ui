import { gql } from "@apollo/client";
import {
  PROJECT_SETTINGS_FIELDS,
  REPO_SETTINGS_FIELDS,
} from "../fragments/projectSettings/index";

const PROJECT_SETTINGS = gql`
  query ProjectSettings($projectIdentifier: String!) {
    projectSettings(projectIdentifier: $projectIdentifier) {
      ...ProjectSettingsFields
    }
  }
  ${PROJECT_SETTINGS_FIELDS}
  ${REPO_SETTINGS_FIELDS}
`;

export default PROJECT_SETTINGS;
