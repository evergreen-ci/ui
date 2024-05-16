import { ProjectSettingsTabRoutes } from "constants/routes";
import * as access from "./AccessTab/transformers";
import * as containers from "./ContainersTab/transformers";
import * as general from "./GeneralTab/transformers";
import * as githubCommitQueue from "./GithubCommitQueueTab/transformers";
import * as notifications from "./NotificationsTab/transformers";
import * as patchAliases from "./PatchAliasesTab/transformers";
import * as periodicBuilds from "./PeriodicBuildsTab/transformers";
import * as plugins from "./PluginsTab/transformers";
import * as projectTriggers from "./ProjectTriggersTab/transformers";
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
  // @ts-ignore: FIXME. This comment was added by an automated script.
  [ProjectSettingsTabRoutes.General]: general.gqlToForm,
  // @ts-ignore: FIXME. This comment was added by an automated script.
  [ProjectSettingsTabRoutes.Access]: access.gqlToForm,
  // @ts-ignore: FIXME. This comment was added by an automated script.
  [ProjectSettingsTabRoutes.Plugins]: plugins.gqlToForm,
  // @ts-ignore: FIXME. This comment was added by an automated script.
  [ProjectSettingsTabRoutes.Variables]: variables.gqlToForm,
  // @ts-ignore: FIXME. This comment was added by an automated script.
  [ProjectSettingsTabRoutes.GithubCommitQueue]: githubCommitQueue.gqlToForm,
  // @ts-ignore: FIXME. This comment was added by an automated script.
  [ProjectSettingsTabRoutes.Notifications]: notifications.gqlToForm,
  [ProjectSettingsTabRoutes.PatchAliases]: patchAliases.gqlToForm,
  // @ts-ignore: FIXME. This comment was added by an automated script.
  [ProjectSettingsTabRoutes.VirtualWorkstation]: virtualWorkstation.gqlToForm,
  // @ts-ignore: FIXME. This comment was added by an automated script.
  [ProjectSettingsTabRoutes.ProjectTriggers]: projectTriggers.gqlToForm,
  // @ts-ignore: FIXME. This comment was added by an automated script.
  [ProjectSettingsTabRoutes.PeriodicBuilds]: periodicBuilds.gqlToForm,
  // @ts-ignore: FIXME. This comment was added by an automated script.
  [ProjectSettingsTabRoutes.Containers]: containers.gqlToForm,
  // @ts-ignore: FIXME. This comment was added by an automated script.
  [ProjectSettingsTabRoutes.ViewsAndFilters]: viewsAndFilters.gqlToForm,
};

export const formToGqlMap: {
  [T in WritableProjectSettingsType]: FormToGqlFunction<T>;
} = {
  // @ts-ignore: FIXME. This comment was added by an automated script.
  [ProjectSettingsTabRoutes.General]: general.formToGql,
  // @ts-ignore: FIXME. This comment was added by an automated script.
  [ProjectSettingsTabRoutes.Access]: access.formToGql,
  // @ts-ignore: FIXME. This comment was added by an automated script.
  [ProjectSettingsTabRoutes.Plugins]: plugins.formToGql,
  // @ts-ignore: FIXME. This comment was added by an automated script.
  [ProjectSettingsTabRoutes.Variables]: variables.formToGql,
  // @ts-ignore: FIXME. This comment was added by an automated script.
  [ProjectSettingsTabRoutes.GithubCommitQueue]: githubCommitQueue.formToGql,
  // @ts-ignore: FIXME. This comment was added by an automated script.
  [ProjectSettingsTabRoutes.Notifications]: notifications.formToGql,
  // @ts-ignore: FIXME. This comment was added by an automated script.
  [ProjectSettingsTabRoutes.PatchAliases]: patchAliases.formToGql,
  // @ts-ignore: FIXME. This comment was added by an automated script.
  [ProjectSettingsTabRoutes.VirtualWorkstation]: virtualWorkstation.formToGql,
  // @ts-ignore: FIXME. This comment was added by an automated script.
  [ProjectSettingsTabRoutes.ProjectTriggers]: projectTriggers.formToGql,
  // @ts-ignore: FIXME. This comment was added by an automated script.
  [ProjectSettingsTabRoutes.PeriodicBuilds]: periodicBuilds.formToGql,
  // @ts-ignore: FIXME. This comment was added by an automated script.
  [ProjectSettingsTabRoutes.Containers]: containers.formToGql,
  // @ts-ignore: FIXME. This comment was added by an automated script.
  [ProjectSettingsTabRoutes.ViewsAndFilters]: viewsAndFilters.formToGql,
};
