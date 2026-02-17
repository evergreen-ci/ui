import { AdminSettingsTabRoutes } from "constants/routes";

export const getTabTitle = (tab: AdminSettingsTabRoutes): { title: string } => {
  const tabTitles = {
    [AdminSettingsTabRoutes.General]: { title: "General Settings" },
    [AdminSettingsTabRoutes.FeatureFlags]: { title: "Feature Flags" },
    [AdminSettingsTabRoutes.RestartTasks]: { title: "Restart Tasks" },
    [AdminSettingsTabRoutes.EventLog]: { title: "Event Log" },
  };

  return tabTitles[tab] || { title: "General Settings" };
};
