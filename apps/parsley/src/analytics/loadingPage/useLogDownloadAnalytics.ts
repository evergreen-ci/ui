import { useAnalyticsRoot } from "analytics/useAnalyticsRoot";
import { LogTypes } from "constants/enums";

type Action =
  | {
      name: "Log downloaded";
      duration: number;
      type: LogTypes;
      fileSize: number;
    }
  | {
      name: "Log download failed";
      duration: number;
      type: LogTypes;
      fileSize: number;
    }
  | {
      name: "Log download incomplete";
      duration: number;
      reason: string;
      downloaded: number;
    };

export const useLogDownloadAnalytics = () =>
  useAnalyticsRoot<Action>("LoadingPage");
