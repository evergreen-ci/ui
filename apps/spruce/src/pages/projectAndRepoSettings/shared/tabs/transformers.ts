import { ProjectSettingsTabRoutes } from "constants/routes";
import * as access from "./AccessTab/transformers";
import * as commitChecks from "./CommitChecksTab/transformers";
import * as general from "./GeneralTab/transformers";
import * as appSettings from "./GithubAppSettingsTab/transformers";
import * as permissionGroups from "./GithubPermissionGroupsTab/transformers";
import * as gitTags from "./GitTagsTab/transformers";
import * as mergeQueue from "./MergeQueueTab/transformers";
import * as notifications from "./NotificationsTab/transformers";
import * as patchAliases from "./PatchAliasesTab/transformers";
import * as periodicBuilds from "./PeriodicBuildsTab/transformers";
import * as plugins from "./PluginsTab/transformers";
import * as projectTriggers from "./ProjectTriggersTab/transformers";
import * as pullRequests from "./PullRequestsTab/transformers";
import * as testSelection from "./TestSelectionTab/transformers";
import {
  FormToGqlFunction,
  GqlToFormFunction,
  WritableProjectSettingsType,
} from "./types";
import * as variables from "./VariablesTab/transformers";
import * as viewsAndFilters from "./ViewsAndFiltersTab/transformers";
import * as virtualWorkstation from "./VirtualWorkstationTab/transformers";

export const gqlToFormMap: {
  [T in WritableProjectSettingsType]: GqlToFormFunction<T>;
} = {
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  [ProjectSettingsTabRoutes.Access]: access.gqlToForm,
  [ProjectSettingsTabRoutes.CommitChecks]: commitChecks.gqlToForm,
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  [ProjectSettingsTabRoutes.General]: general.gqlToForm,
  [ProjectSettingsTabRoutes.GithubAppSettings]: appSettings.gqlToForm,
  [ProjectSettingsTabRoutes.GithubPermissionGroups]: permissionGroups.gqlToForm,
  [ProjectSettingsTabRoutes.GitTags]: gitTags.gqlToForm,
  [ProjectSettingsTabRoutes.MergeQueue]: mergeQueue.gqlToForm,
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  [ProjectSettingsTabRoutes.Notifications]: notifications.gqlToForm,
  [ProjectSettingsTabRoutes.PatchAliases]: patchAliases.gqlToForm,
  [ProjectSettingsTabRoutes.PeriodicBuilds]: periodicBuilds.gqlToForm,
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  [ProjectSettingsTabRoutes.Plugins]: plugins.gqlToForm,
  [ProjectSettingsTabRoutes.ProjectTriggers]: projectTriggers.gqlToForm,
  [ProjectSettingsTabRoutes.PullRequests]: pullRequests.gqlToForm,
  [ProjectSettingsTabRoutes.TestSelection]: testSelection.gqlToForm,
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  [ProjectSettingsTabRoutes.Variables]: variables.gqlToForm,
  [ProjectSettingsTabRoutes.ViewsAndFilters]: viewsAndFilters.gqlToForm,
  [ProjectSettingsTabRoutes.VirtualWorkstation]: virtualWorkstation.gqlToForm,
};

export const formToGqlMap: {
  [T in WritableProjectSettingsType]: FormToGqlFunction<T>;
} = {
  [ProjectSettingsTabRoutes.Access]: access.formToGql,
  [ProjectSettingsTabRoutes.CommitChecks]: commitChecks.formToGql,
  [ProjectSettingsTabRoutes.General]: general.formToGql,
  [ProjectSettingsTabRoutes.GithubAppSettings]: appSettings.formToGql,
  [ProjectSettingsTabRoutes.GithubPermissionGroups]: permissionGroups.formToGql,
  [ProjectSettingsTabRoutes.GitTags]: gitTags.formToGql,
  [ProjectSettingsTabRoutes.MergeQueue]: mergeQueue.formToGql,
  [ProjectSettingsTabRoutes.Notifications]: notifications.formToGql,
  [ProjectSettingsTabRoutes.PatchAliases]: patchAliases.formToGql,
  [ProjectSettingsTabRoutes.PeriodicBuilds]: periodicBuilds.formToGql,
  [ProjectSettingsTabRoutes.Plugins]: plugins.formToGql,
  [ProjectSettingsTabRoutes.ProjectTriggers]: projectTriggers.formToGql,
  [ProjectSettingsTabRoutes.PullRequests]: pullRequests.formToGql,
  [ProjectSettingsTabRoutes.TestSelection]: testSelection.formToGql,
  [ProjectSettingsTabRoutes.Variables]: variables.formToGql,
  [ProjectSettingsTabRoutes.ViewsAndFilters]: viewsAndFilters.formToGql,
  [ProjectSettingsTabRoutes.VirtualWorkstation]: virtualWorkstation.formToGql,
};
