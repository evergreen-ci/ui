export enum ProjectSettingsTabRoutes {
  // Evergreen sections
  General = "general",
  Access = "access",
  Variables = "variables",
  Notifications = "notifications",
  PatchAliases = "patch-aliases",
  VirtualWorkstation = "virtual-workstation",
  ProjectTriggers = "project-triggers",
  PeriodicBuilds = "periodic-builds",
  Plugins = "plugins",
  ViewsAndFilters = "views-and-filters",

  // GitHub sections.
  GithubAppSettings = "github-app-settings",
  GithubPermissionGroups = "github-permission-groups",
  CommitChecks = "commit-checks",
  PullRequests = "pull-requests",
  MergeQueue = "merge-queue",
  GitTags = "git-tags",

  // Event log.
  EventLog = "event-log",
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
