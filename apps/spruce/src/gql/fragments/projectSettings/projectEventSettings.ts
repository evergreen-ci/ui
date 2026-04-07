import { gql } from "@apollo/client";
import { PROJECT_ACCESS_SETTINGS } from "./access";
import { ALIAS } from "./aliases";
import { PROJECT_EVENT_APP_SETTINGS } from "./appSettings";
import { PROJECT_GENERAL_SETTINGS } from "./general";
import {
  PROJECT_GITHUB_SETTINGS,
  PROJECT_EVENT_GITHUB_COMMIT_QUEUE,
} from "./githubCommitQueue";
import { PROJECT_NOTIFICATION_SETTINGS, SUBSCRIPTIONS } from "./notifications";
import { PROJECT_PATCH_ALIAS_SETTINGS } from "./patchAliases";
import { PROJECT_PERIODIC_BUILDS_SETTINGS } from "./periodicBuilds";
import { PROJECT_EVENT_PERMISSION_GROUP_SETTINGS } from "./permissionGroups";
import { PROJECT_PLUGINS_SETTINGS } from "./plugins";
import { PROJECT_TRIGGERS_SETTINGS } from "./projectTriggers";
import { PROJECT_TEST_SELECTION_SETTINGS } from "./testSelection";
import { VARIABLES } from "./variables";
import { PROJECT_VIEWS_AND_FILTERS_SETTINGS } from "./viewsAndFilters";
import { PROJECT_VIRTUAL_WORKSTATION_SETTINGS } from "./virtualWorkstation";

export const PROJECT_EVENT_SETTINGS = gql`
  fragment ProjectEventSettings on ProjectEventSettings {
    ...ProjectEventAppSettings
    ...ProjectEventGithubCommitQueue
    ...ProjectEventPermissionGroupSettings
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
      hidden
      identifier
      repoRefId
      tracksPushEvents
      versionControlEnabled
    }
    subscriptions {
      ...Subscriptions
    }
    vars {
      ...Variables
    }
  }
  ${PROJECT_EVENT_APP_SETTINGS}
  ${PROJECT_EVENT_GITHUB_COMMIT_QUEUE}
  ${PROJECT_GITHUB_SETTINGS}
  ${PROJECT_EVENT_PERMISSION_GROUP_SETTINGS}
  ${ALIAS}
  ${PROJECT_ACCESS_SETTINGS}
  ${PROJECT_GENERAL_SETTINGS}
  ${PROJECT_NOTIFICATION_SETTINGS}
  ${SUBSCRIPTIONS}
  ${PROJECT_PATCH_ALIAS_SETTINGS}
  ${PROJECT_PERIODIC_BUILDS_SETTINGS}
  ${PROJECT_PLUGINS_SETTINGS}
  ${PROJECT_TEST_SELECTION_SETTINGS}
  ${PROJECT_TRIGGERS_SETTINGS}
  ${PROJECT_VIEWS_AND_FILTERS_SETTINGS}
  ${PROJECT_VIRTUAL_WORKSTATION_SETTINGS}
  ${VARIABLES}
`;
