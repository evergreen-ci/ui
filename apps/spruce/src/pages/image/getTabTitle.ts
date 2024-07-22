import { ImageTabRoutes } from "constants/routes";

export const getTabTitle = (tab: ImageTabRoutes): { title: string } => {
  switch (tab) {
    case ImageTabRoutes.BuildInformation:
      return {
        title: "Build Information",
      };
    case ImageTabRoutes.EventLog:
      return {
        title: "Event Log",
      };
    default:
      return {
        title: "Build Information",
      };
  }
};
