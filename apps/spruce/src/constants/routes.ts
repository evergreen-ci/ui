import { generatePath } from "react-router";
import { stringifyQuery } from "@evg-ui/lib/src/utils/query-string";
import { getGithubCommitUrl } from "constants/externalResources";
import { WaterfallFilterOptions } from "pages/waterfall/types";
import { TestStatus, HistoryQueryParams } from "types/history";
import { ConfigurePatchPageTabs, VersionPageTabs } from "types/patch";
import { LogTypes, TaskTab } from "types/task";
import { ProjectTriggerLevel } from "types/triggers";
import { toArray } from "utils/array";

export enum PageNames {
  HTMLLog = "html-log",
  Patches = "patches",
  Settings = "settings",
}

export enum SpawnTab {
  Host = "host",
  Volume = "volume",
}

export enum PreferencesTabRoutes {
  Profile = "profile",
  Notifications = "notifications",
  CLI = "cli",
  UISettings = "ui-settings",
  PublicKeys = "publickeys",
}

export enum ImageTabRoutes {
  BuildInformation = "build-information",
  EventLog = "event-log",
}

// Enums should be ordered in view order.
export enum ProjectSettingsTabRoutes {
  General = "general",
  Access = "access",
  Variables = "variables",
  GithubCommitQueue = "github-commitqueue",
  Notifications = "notifications",
  PatchAliases = "patch-aliases",
  VirtualWorkstation = "virtual-workstation",
  Containers = "containers",
  ViewsAndFilters = "views-and-filters",
  ProjectTriggers = "project-triggers",
  PeriodicBuilds = "periodic-builds",
  TestSelection = "test-selection",
  Plugins = "plugins",
  GithubAppSettings = "github-app-settings",
  GithubPermissionGroups = "github-permission-groups",
  EventLog = "event-log",
}

export enum AdminSettingsGeneralSection {
  Announcements = "announcements",
  FeatureFlags = "feature-flags",
  Runners = "runners",
  Web = "web",
  Authentication = "authentication",
  ExternalCommunications = "external-communications",
  BackgroundProcessing = "background-processing",
  Providers = "providers",
  Other = "other",
}

export enum AdminSettingsTabRoutes {
  General = "general",
  RestartTasks = "restart-tasks",
  EventLog = "event-log",
}

export enum DistroSettingsTabRoutes {
  General = "general",
  Provider = "provider",
  Task = "task",
  Host = "host",
  Project = "project",
  EventLog = "event-log",
  SingleTaskDistros = "single-task-distros",
}
const paths = {
  adminSettings: "/admin-settings",
  container: "/container",
  distro: "/distro",
  distros: "/distros",
  host: "/host",
  hosts: "/hosts",
  image: "/image",
  jobLogs: "/job-logs",
  login: "/login",
  patch: "/patch",
  preferences: "/preferences",
  project: "/project",
  projects: "/projects",
  repo: "/repo",
  spawn: "/spawn",
  task: "/task",
  taskQueue: "/task-queue",
  user: "/user",
  variantHistory: "/variant-history",
  version: "/version",
  waterfall: "/waterfall",
};

export enum slugs {
  buildId = "buildId",
  distroId = "distroId",
  execution = "execution",
  groupId = "groupId",
  hostId = "hostId",
  imageId = "imageId",
  patchId = "patchId",
  podId = "podId",
  projectIdentifier = "projectIdentifier",
  repoId = "repoId",
  tab = "tab",
  taskId = "taskId",
  taskName = "taskName",
  variantName = "variantName",
  versionId = "versionId",
  userId = "userId",
}
export const idSlugs = [
  slugs.buildId,
  slugs.podId,
  slugs.distroId,
  slugs.hostId,
  slugs.imageId,
  slugs.patchId,
  slugs.projectIdentifier,
  slugs.taskId,
  slugs.versionId,
  slugs.userId,
];

export const redirectRoutes = {
  distroSettings: paths.distros,
  patch: `${paths.patch}/:${slugs.versionId}`,
  projectSettings: paths.projects,
  userPatches: `${paths.user}/:${slugs.userId}`,
  waterfall: `${paths.waterfall}/:${slugs.projectIdentifier}`,
  legacyCommits: `commits/:${slugs.projectIdentifier}`,
};

export const routes = {
  adminSettings: paths.adminSettings,
  configurePatch: `${paths.patch}/:${slugs.patchId}/configure/:${slugs.tab}?`,
  container: `${paths.container}/:${slugs.podId}`,
  distroSettings: `${paths.distro}/:${slugs.distroId}/${PageNames.Settings}`,
  host: `${paths.host}/:${slugs.hostId}`,
  hosts: paths.hosts,
  image: `${paths.image}/:${slugs.imageId}`,
  jobLogs: paths.jobLogs,
  login: paths.login,
  myPatches: `${paths.user}/${PageNames.Patches}`,
  preferences: paths.preferences,
  projectPatches: `${paths.project}/:${slugs.projectIdentifier}/${PageNames.Patches}`,
  projectSettings: `${paths.project}/:${slugs.projectIdentifier}/${PageNames.Settings}`,
  repoSettings: `${paths.repo}/:${slugs.repoId}/${PageNames.Settings}`,
  spawn: paths.spawn,
  spawnHost: `${paths.spawn}/${SpawnTab.Host}`,
  spawnVolume: `${paths.spawn}/${SpawnTab.Volume}`,
  task: `${paths.task}/:${slugs.taskId}/:${slugs.tab}?`,
  taskHTMLLog: `${paths.task}/:${slugs.taskId}/${PageNames.HTMLLog}`,
  taskQueue: `${paths.taskQueue}/:${slugs.distroId}?`,
  user: paths.user,
  userPatches: `${paths.user}/:${slugs.userId}/${PageNames.Patches}`,
  variantHistory: `${paths.variantHistory}/:${slugs.projectIdentifier}/:${slugs.variantName}`,
  version: `${paths.version}/:${slugs.versionId}/:${slugs.tab}?`,
  waterfall: `${paths.project}/:${slugs.projectIdentifier}/waterfall`,
};

export const getUserPatchesRoute = (userId: string): string =>
  `${paths.user}/${userId}/${PageNames.Patches}`;

export const getVersionRoute = (
  versionId: string,
  options?: {
    tab?: VersionPageTabs;
    variant?: string;
    page?: number;
    statuses?: string[];
    sorts?: string | string[];
  },
) => {
  const { tab, ...rest } = options || {};
  const queryParams = stringifyQuery({
    ...rest,
  });
  return `${paths.version}/${versionId}/${tab ?? VersionPageTabs.Tasks}${
    queryParams && `?${queryParams}`
  }`;
};

export const getPatchRoute = (
  patchId: string,
  options: {
    tab?: ConfigurePatchPageTabs;
    configure: boolean;
  },
) => {
  const { configure, tab, ...rest } = options || {};
  const queryParams = stringifyQuery({
    ...rest,
  });
  if (!configure) return getVersionRoute(patchId);
  return `${paths.patch}/${patchId}/configure/${
    tab ?? ConfigurePatchPageTabs.Tasks
  }${queryParams && `?${queryParams}`}`;
};

export const getHostRoute = (hostId: string) => `${paths.host}/${hostId}`;

export const getPodRoute = (podId: string) => `${paths.container}/${podId}`;

export const getAllHostsRoute = (options?: {
  hostId?: string;
  distroId?: string;
  statuses?: string[];
  currentTaskId?: string;
  startedBy?: string;
}) => {
  const { ...rest } = options || {};
  const queryParams = stringifyQuery({
    ...rest,
  });
  return `${paths.hosts}?${queryParams}`;
};

export type GetTaskRouteOptions = {
  tab?: TaskTab;
  execution?: number;
  [key: string]: any;
};
export const getTaskRoute = (taskId: string, options?: GetTaskRouteOptions) => {
  const { tab, ...rest } = options || {};
  const queryParams = stringifyQuery({
    ...rest,
  });
  return `${paths.task}/${taskId}${tab ? `/${tab}` : ""}${
    queryParams ? `?${queryParams}` : ""
  }`;
};

export const getTaskHTMLLogRoute = (
  taskId: string,
  execution: number,
  origin: LogTypes,
) => {
  const queryParams = stringifyQuery({
    execution,
    origin,
  });
  return generatePath(`${routes.taskHTMLLog}/?${queryParams}`, { taskId });
};

export const getPreferencesRoute = (tab?: PreferencesTabRoutes) =>
  `${paths.preferences}/${tab}`;

export const getTaskQueueRoute = (distro: string, taskId?: string) => {
  const queryParams = stringifyQuery({
    taskId,
  });
  return `${paths.taskQueue}/${distro}${taskId ? `?${queryParams}` : ""}`;
};
export const getSpawnHostRoute = ({
  distroId,
  host,
  spawnHost,
  taskId,
}: {
  distroId?: string;
  host?: string;
  taskId?: string;
  spawnHost?: boolean;
}) => {
  const queryParams = stringifyQuery({
    ...(spawnHost && { spawnHost: "True" }),
    distroId,
    taskId,
    host,
  });
  return `${routes.spawnHost}?${queryParams}`;
};

export const getSpawnVolumeRoute = (volume: string) => {
  const queryParams = stringifyQuery({
    volume,
  });
  return `${routes.spawnVolume}?${queryParams}`;
};

export const getProjectPatchesRoute = (projectIdentifier: string) =>
  `${paths.project}/${encodeURIComponent(projectIdentifier)}/${
    PageNames.Patches
  }`;

export const getImageRoute = (
  imageId: string,
  tab?: ImageTabRoutes,
  anchor?: string,
) =>
  `${paths.image}/${imageId}/${tab ?? ImageTabRoutes.BuildInformation}${anchor ? `#${anchor}` : ""}`;

export const getProjectSettingsRoute = (
  projectId: string,
  tab?: ProjectSettingsTabRoutes,
) => {
  // Encode projectId for backwards compatibilty.
  // Encoding can be removed when all projectIDs are URL friendly without encoding
  const encodedProjectId = encodeURIComponent(projectId);
  const root = `${paths.project}/${encodedProjectId}/${PageNames.Settings}`;
  return tab ? `${root}/${tab}` : root;
};

export const getRepoSettingsRoute = (
  repoId: string,
  tab?: ProjectSettingsTabRoutes,
) => {
  const root = `${paths.repo}/${repoId}/${PageNames.Settings}`;
  return tab ? `${root}/${tab}` : root;
};

export const getDistroSettingsRoute = (
  distroId: string,
  tab?: DistroSettingsTabRoutes,
) =>
  tab
    ? `${paths.distro}/${distroId}/${PageNames.Settings}/${tab}`
    : `${paths.distro}/${distroId}/${PageNames.Settings}/${DistroSettingsTabRoutes.General}`;

export const getWaterfallRoute = (
  projectIdentifier?: string,
  options?: {
    statusFilters?: string[];
    variantFilters?: string[];
    requesterFilters?: string[];
    taskFilters?: string[];
  },
) => {
  const { requesterFilters, statusFilters, taskFilters, variantFilters } =
    options || {};
  const queryParams = stringifyQuery({
    [WaterfallFilterOptions.Statuses]: statusFilters,
    [WaterfallFilterOptions.Task]: taskFilters,
    [WaterfallFilterOptions.Requesters]: requesterFilters,
    [WaterfallFilterOptions.BuildVariant]: variantFilters,
  });
  return `${paths.project}/${encodeURIComponent(projectIdentifier ?? "")}${paths.waterfall}${queryParams ? `?${queryParams}` : ""}`;
};

const getHistoryRoute = (
  basePath: string,
  filters?: {
    failingTests?: string[];
    passingTests?: string[];
  },
  selectedCommit?: number,
  visibleColumns?: string[],
  taskId?: string,
) => {
  if (filters || selectedCommit || visibleColumns || taskId) {
    const failingTests = toArray(filters?.failingTests);
    const passingTests = toArray(filters?.passingTests);

    const queryParams = stringifyQuery({
      [TestStatus.Failed]: failingTests,
      [TestStatus.Passed]: passingTests,
      [HistoryQueryParams.SelectedCommit]: selectedCommit,
      [HistoryQueryParams.TaskID]: taskId,
      [HistoryQueryParams.VisibleColumns]: visibleColumns,
    });
    return `${basePath}?${queryParams}`;
  }
  return basePath;
};
export const getVariantHistoryRoute = (
  projectIdentifier: string,
  variantName: string,
  options?: {
    filters?: {
      failingTests?: string[];
      passingTests?: string[];
    };
    selectedCommit?: number;
    visibleColumns?: string[];
  },
) => {
  const { filters, selectedCommit, visibleColumns } = options || {};
  return getHistoryRoute(
    `${paths.variantHistory}/${encodeURIComponent(
      projectIdentifier,
    )}/${encodeURIComponent(variantName)}`,
    filters,
    selectedCommit,
    visibleColumns,
  );
};

export const getTriggerRoute = ({
  triggerType,
  upstreamOwner,
  upstreamRepo,
  upstreamRevision,
  upstreamTask,
  upstreamVersion,
}: {
  triggerType: string;
  upstreamTask: any;
  upstreamVersion: any;
  upstreamRevision: string;
  upstreamOwner: string;
  upstreamRepo: string;
}) => {
  if (triggerType === ProjectTriggerLevel.TASK) {
    return getTaskRoute(upstreamTask.id);
  }
  if (triggerType === ProjectTriggerLevel.PUSH) {
    return getGithubCommitUrl(upstreamOwner, upstreamRepo, upstreamRevision);
  }
  return getVersionRoute(upstreamVersion.id);
};

export const getAdminSettingsRoute = (
  tab?: AdminSettingsTabRoutes,
  anchor?: string,
) => {
  const pathName = tab
    ? `${paths.adminSettings}/${tab}`
    : `${paths.adminSettings}/${AdminSettingsTabRoutes.General}`;

  if (anchor && pathName.includes(AdminSettingsTabRoutes.General)) {
    return `${pathName}#${anchor}`;
  }
  return pathName;
};
