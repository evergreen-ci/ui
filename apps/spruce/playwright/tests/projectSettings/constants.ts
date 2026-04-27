export enum ProjectSettingsTabRoutes {
  General = "general",
  Access = "access",
  Variables = "variables",
  GithubCommitQueue = "github-commitqueue",
  Notifications = "notifications",
  PatchAliases = "patch-aliases",
  VirtualWorkstation = "virtual-workstation",
  ProjectTriggers = "project-triggers",
  PeriodicBuilds = "periodic-builds",
  Plugins = "plugins",
  EventLog = "event-log",
  ViewsAndFilters = "views-and-filters",
  GithubAppSettings = "github-app-settings",
  GithubPermissionGroups = "github-permission-groups",
}

export const getProjectSettingsRoute = (
  identifier: string,
  tab: ProjectSettingsTabRoutes = ProjectSettingsTabRoutes.General,
) => `/project/${identifier}/settings/${tab}`;

export const getRepoSettingsRoute = (
  repoId: string,
  tab: ProjectSettingsTabRoutes = ProjectSettingsTabRoutes.General,
) => `/repo/${repoId}/settings/${tab}`;

export const project = "spruce";
export const projectUseRepoEnabled = "evergreen";
export const repo = "602d70a2b2373672ee493184";
