import { AdminSettingsTabRoutes } from "constants/routes";

export const getTabTitle = (tab: AdminSettingsTabRoutes): { title: string } => {
  const tabTitles = {
    [AdminSettingsTabRoutes.EventLog]: { title: "Event Log" },
    [AdminSettingsTabRoutes.General]: { title: "General Settings" },
    [AdminSettingsTabRoutes.RestartTasks]: { title: "Restart Tasks" },
    [AdminSettingsTabRoutes.ServiceFlags]: { title: "Service Flags" },
  };

  return tabTitles[tab] || { title: "General Settings" };
};
