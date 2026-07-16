import { ProjectSettingsTabRoutes } from "constants/routes";

export const getTabTitle = (
  tab: ProjectSettingsTabRoutes = ProjectSettingsTabRoutes.General,
): { title: string } => {
  const defaultTitle = {
    title: "General Settings",
  };
  return (
    {
      [ProjectSettingsTabRoutes.Access]: {
        title: "Access Settings & Admin",
      },
      [ProjectSettingsTabRoutes.CommitChecks]: {
        title: "Commit Checks",
      },
      [ProjectSettingsTabRoutes.EventLog]: {
        title: "Event Log",
      },
      [ProjectSettingsTabRoutes.General]: defaultTitle,
      [ProjectSettingsTabRoutes.GithubAppSettings]: {
        title: "App Settings",
      },
      [ProjectSettingsTabRoutes.GithubPermissionGroups]: {
        title: "Permission Groups",
      },
      [ProjectSettingsTabRoutes.GitTags]: {
        title: "Git Tags",
      },
      [ProjectSettingsTabRoutes.MergeQueue]: {
        title: "Merge Queue",
      },
      [ProjectSettingsTabRoutes.Notifications]: {
        title: "Notifications",
      },
      [ProjectSettingsTabRoutes.PatchAliases]: {
        title: "Patch Aliases",
      },
      [ProjectSettingsTabRoutes.PeriodicBuilds]: {
        title: "Periodic Builds",
      },
      [ProjectSettingsTabRoutes.Plugins]: {
        title: "Plugins",
      },
      [ProjectSettingsTabRoutes.ProjectTriggers]: {
        title: "Project Triggers",
      },
      [ProjectSettingsTabRoutes.PullRequests]: {
        title: "Pull Request Testing",
      },
      [ProjectSettingsTabRoutes.TestSelection]: {
        title: "Test Selection",
      },
      [ProjectSettingsTabRoutes.Variables]: {
        title: "Variables",
      },
      [ProjectSettingsTabRoutes.ViewsAndFilters]: {
        title: "Views & Filters",
      },
      [ProjectSettingsTabRoutes.VirtualWorkstation]: {
        title: "Virtual Workstation",
      },
    }[tab] ?? defaultTitle
  );
};
