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
      [ProjectSettingsTabRoutes.MergeQueue]: {
        title: "Merge Queue",
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
      [ProjectSettingsTabRoutes.EventLog]: {
        title: "Event Log",
      },
      [ProjectSettingsTabRoutes.PullRequests]: {
        title: "Pull Request Testing",
      },
      [ProjectSettingsTabRoutes.CommitChecks]: {
        title: "Commit Checks",
      },
      [ProjectSettingsTabRoutes.GitTags]: {
        title: "Git Tags",
      },
      [ProjectSettingsTabRoutes.GithubAppSettings]: {
        title: "App Settings",
      },
      [ProjectSettingsTabRoutes.GithubPermissionGroups]: {
        title: "Permission Groups",
      },
    }[tab] ?? defaultTitle
  );
};
