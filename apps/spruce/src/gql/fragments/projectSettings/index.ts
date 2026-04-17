import { gql } from "@apollo/client";
import { PROJECT_ACCESS_SETTINGS, REPO_ACCESS_SETTINGS } from "./access";
import { ALIAS } from "./aliases";
import { PROJECT_APP_SETTINGS, REPO_APP_SETTINGS } from "./appSettings";
import { PROJECT_GENERAL_SETTINGS, REPO_GENERAL_SETTINGS } from "./general";
import {
  PROJECT_GITHUB_SETTINGS,
  REPO_GITHUB_SETTINGS,
  PROJECT_GITHUB_COMMIT_QUEUE,
  REPO_GITHUB_COMMIT_QUEUE,
} from "./githubCommitQueue";
import {
  PROJECT_NOTIFICATION_SETTINGS,
  REPO_NOTIFICATION_SETTINGS,
  SUBSCRIPTIONS,
} from "./notifications";
import {
  PROJECT_PATCH_ALIAS_SETTINGS,
  REPO_PATCH_ALIAS_SETTINGS,
} from "./patchAliases";
import {
  PROJECT_PERIODIC_BUILDS_SETTINGS,
  REPO_PERIODIC_BUILDS_SETTINGS,
} from "./periodicBuilds";
import {
  PROJECT_PERMISSION_GROUP_SETTINGS,
  REPO_PERMISSION_GROUP_SETTINGS,
} from "./permissionGroups";
import { PROJECT_PLUGINS_SETTINGS, REPO_PLUGINS_SETTINGS } from "./plugins";
import {
  PROJECT_TRIGGERS_SETTINGS,
  REPO_TRIGGERS_SETTINGS,
} from "./projectTriggers";
import {
  PROJECT_TEST_SELECTION_SETTINGS,
  REPO_TEST_SELECTION_SETTINGS,
} from "./testSelection";
import { VARIABLES } from "./variables";
import {
  PROJECT_VIEWS_AND_FILTERS_SETTINGS,
  REPO_VIEWS_AND_FILTERS_SETTINGS,
} from "./viewsAndFilters";
import {
  PROJECT_VIRTUAL_WORKSTATION_SETTINGS,
  REPO_VIRTUAL_WORKSTATION_SETTINGS,
} from "./virtualWorkstation";

export const PROJECT_SETTINGS_FIELDS = gql`
  fragment ProjectSettingsFields on ProjectSettings {
    ...ProjectAppSettings
    ...ProjectGithubCommitQueue
    ...ProjectPermissionGroupSettings
    aliases {
      ...Alias
    }
    projectRef {
      ...ProjectAccessSettings
      ...ProjectGeneralSettings
      ...ProjectNotificationSettings
      ...ProjectPatchAliasSettings
      ...ProjectPeriodicBuildsSettings
      ...ProjectPluginsSettings
      ...ProjectTestSelectionSettings
      ...ProjectTriggersSettings
      ...ProjectViewsAndFiltersSettings
      ...ProjectVirtualWorkstationSettings
      id
      identifier
      repoRefId
    }
    subscriptions {
      ...Subscriptions
    }
    vars {
      ...Variables
    }
  }
  ${PROJECT_ACCESS_SETTINGS}
  ${ALIAS}
  ${PROJECT_APP_SETTINGS}
  ${PROJECT_GENERAL_SETTINGS}
  ${PROJECT_GITHUB_SETTINGS}
  ${PROJECT_GITHUB_COMMIT_QUEUE}
  ${PROJECT_NOTIFICATION_SETTINGS}
  ${SUBSCRIPTIONS}
  ${PROJECT_PATCH_ALIAS_SETTINGS}
  ${PROJECT_PERIODIC_BUILDS_SETTINGS}
  ${PROJECT_PERMISSION_GROUP_SETTINGS}
  ${PROJECT_PLUGINS_SETTINGS}
  ${PROJECT_TEST_SELECTION_SETTINGS}
  ${PROJECT_TRIGGERS_SETTINGS}
  ${PROJECT_VIEWS_AND_FILTERS_SETTINGS}
  ${PROJECT_VIRTUAL_WORKSTATION_SETTINGS}
  ${VARIABLES}
`;

export const REPO_SETTINGS_FIELDS = gql`
  fragment RepoSettingsFields on RepoSettings {
    ...RepoAppSettings
    ...RepoGithubCommitQueue
    ...RepoPermissionGroupSettings
    aliases {
      ...Alias
    }
    projectRef {
      ...RepoAccessSettings
      ...RepoGeneralSettings
      ...RepoNotificationSettings
      ...RepoPatchAliasSettings
      ...RepoPeriodicBuildsSettings
      ...RepoPluginsSettings
      ...RepoTestSelectionSettings
      ...RepoTriggersSettings
      ...RepoViewsAndFiltersSettings
      ...RepoVirtualWorkstationSettings
      id
      displayName
    }
    subscriptions {
      ...Subscriptions
    }
    vars {
      ...Variables
    }
  }
  ${REPO_ACCESS_SETTINGS}
  ${ALIAS}
  ${REPO_APP_SETTINGS}
  ${REPO_GENERAL_SETTINGS}
  ${REPO_GITHUB_SETTINGS}
  ${REPO_GITHUB_COMMIT_QUEUE}
  ${REPO_NOTIFICATION_SETTINGS}
  ${SUBSCRIPTIONS}
  ${REPO_PATCH_ALIAS_SETTINGS}
  ${REPO_PERIODIC_BUILDS_SETTINGS}
  ${REPO_PERMISSION_GROUP_SETTINGS}
  ${REPO_PLUGINS_SETTINGS}
  ${REPO_TEST_SELECTION_SETTINGS}
  ${REPO_TRIGGERS_SETTINGS}
  ${REPO_VIEWS_AND_FILTERS_SETTINGS}
  ${REPO_VIRTUAL_WORKSTATION_SETTINGS}
  ${VARIABLES}
`;
