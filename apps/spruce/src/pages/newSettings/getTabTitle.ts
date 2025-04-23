import { ProjectSettingsTabRoutes } from "constants/routes";

export const getTabTitle = (
  tab: ProjectSettingsTabRoutes = ProjectSettingsTabRoutes.General,
): { title: string; dataCy: string } => {
  switch (tab) {
    case ProjectSettingsTabRoutes.General:
      return { title: "General", dataCy: "general-tab" };
    case ProjectSettingsTabRoutes.Access:
      return { title: "Access", dataCy: "access-tab" };
    case ProjectSettingsTabRoutes.Variables:
      return { title: "Variables", dataCy: "variables-tab" };
    case ProjectSettingsTabRoutes.GithubCommitQueue:
      return {
        title: "GitHub Commit Queue",
        dataCy: "github-commit-queue-tab",
      };
    case ProjectSettingsTabRoutes.Notifications:
      return { title: "Notifications", dataCy: "notifications-tab" };
    case ProjectSettingsTabRoutes.PatchAliases:
      return { title: "Patch Aliases", dataCy: "patch-aliases-tab" };
    case ProjectSettingsTabRoutes.VirtualWorkstation:
      return {
        title: "Virtual Workstation",
        dataCy: "virtual-workstation-tab",
      };
    case ProjectSettingsTabRoutes.Containers:
      return { title: "Containers", dataCy: "containers-tab" };
    case ProjectSettingsTabRoutes.ViewsAndFilters:
      return { title: "Views and Filters", dataCy: "views-and-filters-tab" };
    case ProjectSettingsTabRoutes.ProjectTriggers:
      return { title: "Project Triggers", dataCy: "project-triggers-tab" };
    case ProjectSettingsTabRoutes.PeriodicBuilds:
      return { title: "Periodic Builds", dataCy: "periodic-builds-tab" };
    case ProjectSettingsTabRoutes.Plugins:
      return { title: "Plugins", dataCy: "plugins-tab" };
    case ProjectSettingsTabRoutes.EventLog:
      return { title: "Event Log", dataCy: "event-log-tab" };
    case ProjectSettingsTabRoutes.GithubAppSettings:
      return {
        title: "GitHub App Settings",
        dataCy: "github-app-settings-tab",
      };
    case ProjectSettingsTabRoutes.GithubPermissionGroups:
      return {
        title: "GitHub Permission Groups",
        dataCy: "github-permission-groups-tab",
      };
    default:
      return { title: "General", dataCy: "general-tab" };
  }
};
