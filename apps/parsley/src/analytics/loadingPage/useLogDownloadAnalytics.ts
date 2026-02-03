import { useAnalyticsRoot } from "@evg-ui/lib/analytics";
import { AnalyticsIdentifier } from "analytics/types";
import { LogTypes } from "constants/enums";

type Action =
  | {
      name: "System Event log downloaded";
      duration: number;
      "log.type": LogTypes;
      "log.size": number;
    }
  | {
      name: "System Event log download failed";
      duration: number;
      "log.type": LogTypes;
      "log.size": number;
      reason: string;
    }
  | {
      name: "System Event log download incomplete";
      duration: number;
      reason: string;
      downloaded: number;
    };

export const useLogDownloadAnalytics = () =>
  useAnalyticsRoot<Action, AnalyticsIdentifier>("LoadingPage");
