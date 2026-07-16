import { DistroSettingsTabRoutes } from "constants/routes";

export const getTabTitle = (tab: DistroSettingsTabRoutes): { title: string } =>
  ({
    [DistroSettingsTabRoutes.EventLog]: { title: "Event Log" },
    [DistroSettingsTabRoutes.General]: { title: "General Settings" },
    [DistroSettingsTabRoutes.Host]: { title: "Host Settings" },
    [DistroSettingsTabRoutes.Project]: { title: "Project Settings" },
    [DistroSettingsTabRoutes.Provider]: { title: "Provider Settings" },
    [DistroSettingsTabRoutes.SingleTaskDistros]: {
      title: "Single Task Distros",
    },
    [DistroSettingsTabRoutes.Task]: { title: "Task Settings" },
  })[tab];
