import { ImageTabRoutes } from "constants/routes";

export const getTabTitle = (tab: ImageTabRoutes): { title: string } =>
  ({
    [ImageTabRoutes.BuildInformation]: { title: "Build Information" },
    [ImageTabRoutes.EventLog]: { title: "Event Log" },
  })[tab];
