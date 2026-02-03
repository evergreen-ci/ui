import { useAnalyticsRoot } from "@evg-ui/lib/analytics";
import { AnalyticsIdentifier } from "analytics/types";
import { LogTypes } from "constants/enums";

type Action =
  | { name: "Clicked file upload link"; "has.logs": boolean }
  | { name: "Used file dropper to upload file" }
  | {
      name: "System Event processed uploaded log file";
      "log.type": LogTypes;
      "file.size"?: number;
    }
  | {
      name: "Used clipboard paste to upload log file";
    };

export const useLogDropAnalytics = () =>
  useAnalyticsRoot<Action, AnalyticsIdentifier>("LogDrop");
