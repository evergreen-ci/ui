import { useAnalyticsRoot } from "@evg-ui/lib/analytics/hooks";
import { AnalyticsObject } from "analytics/types";
import { LogTypes } from "constants/enums";

type Action =
  | { name: "Clicked file upload link"; hasLogs: boolean }
  | { name: "Used file dropper to upload file" }
  | {
      name: "System Event processed uploaded log file";
      logType: LogTypes;
      fileSize?: number;
    };

export const useLogDropAnalytics = () =>
  useAnalyticsRoot<Action, AnalyticsObject>("LogDrop");
