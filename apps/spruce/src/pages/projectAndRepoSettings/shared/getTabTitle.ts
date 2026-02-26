import { ProjectSettingsTabRoutes } from "constants/routes";

export const getTabTitle = (
  tab: ProjectSettingsTabRoutes = ProjectSettingsTabRoutes.General,
): { title: string } => {
  const defaultTitle = {
    title: "General Settings",
  };
  return (
    {
      [ProjectSettingsTabRoutes.General]: defaultTitle,
      [ProjectSettingsTabRoutes.Access]: {
        title: "Access Settings & Admin",
      },
      [ProjectSettingsTabRoutes.Variables]: {
        title: "Variables",
      },
      [ProjectSettingsTabRoutes.GithubCommitQueue]: {
        title: "GitHub",
      },
      [ProjectSettingsTabRoutes.Notifications]: {
        title: "Notifications",
      },
      [ProjectSettingsTabRoutes.PatchAliases]: {
        title: "Patch Aliases",
      },
      [ProjectSettingsTabRoutes.VirtualWorkstation]: {
        title: "Virtual Workstation",
      },
      [ProjectSettingsTabRoutes.ViewsAndFilters]: {
        title: "Views & Filters",
      },
      [ProjectSettingsTabRoutes.ProjectTriggers]: {
        title: "Project Triggers",
      },
      [ProjectSettingsTabRoutes.PeriodicBuilds]: {
        title: "Periodic Builds",
      },
      [ProjectSettingsTabRoutes.TestSelection]: {
        title: "Test Selection",
      },
      [ProjectSettingsTabRoutes.Plugins]: {
        title: "Plugins",
      },
      [ProjectSettingsTabRoutes.GithubAppSettings]: {
        title: "GitHub App Settings",
      },
      [ProjectSettingsTabRoutes.GithubPermissionGroups]: {
        title: "GitHub Permission Groups",
      },
      [ProjectSettingsTabRoutes.EventLog]: {
        title: "Event Log",
      },
    }[tab] ?? defaultTitle
  );
};
