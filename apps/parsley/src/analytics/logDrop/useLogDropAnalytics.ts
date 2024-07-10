import { useAnalyticsRoot } from "analytics/useAnalyticsRoot";
import { LogTypes } from "constants/enums";

type Action =
  | { name: "Clicked upload link"; hasLogs: boolean }
  | { name: "Dropped file" }
  | { name: "Uploaded log file with picker" }
  | { name: "Processed log"; logType: LogTypes; fileSize?: number };

export const useLogDropAnalytics = () => useAnalyticsRoot<Action>("LogDrop");
