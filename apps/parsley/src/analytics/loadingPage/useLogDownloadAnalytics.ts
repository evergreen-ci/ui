import { useAnalyticsRoot } from "analytics/useAnalyticsRoot";
import { LogTypes } from "constants/enums";

type Action =
  | {
      name: "System Event log downloaded";
      duration: number;
      type: LogTypes;
      fileSize: number;
    }
  | {
      name: "System Event log download failed";
      duration: number;
      type: LogTypes;
      fileSize: number;
    }
  | {
      name: "System Event log download incomplete";
      duration: number;
      reason: string;
      downloaded: number;
    };

export const useLogDownloadAnalytics = () =>
  useAnalyticsRoot<Action>("LoadingPage");
