import { useAnalyticsRoot } from "@evg-ui/lib/analytics/hooks";
import { AnalyticsIdentifier } from "analytics/types";

type Action =
  | { name: "Clicked copy SSH command button" }
  | { name: "Changed host status"; status: string }
  | { name: "Toggled spawn host details panel"; expanded: boolean }
  | { name: "Viewed spawn host modal" }
  | { name: "Viewed edit spawn host modal"; "host.id": string; status: string }
  | {
      name: "Changed spawn host settings";
    }
  | {
      name: "Created a spawn host";
      "is.volume.migration": boolean;
      "is.workstation": boolean;
      "distro.id": string;
      "no.expire": boolean;
    }
  | { name: "Viewed spawn volume modal" }
  | {
      name: "Changed mounted volume on host";
      "volume.id": string;
      "host.id": string;
    }
  | { name: "Deleted a volume"; "volume.id": string }
  | { name: "Changed unmounted volume on host"; "volume.id": string }
  | {
      name: "Created a volume";
      "volume.type": string;
      "volume.size": number;
      "volume.no.expire": boolean;
    }
  | {
      name: "Changed spawn volume settings";
      "volume.no.expire": boolean;
    }
  | { name: "Clicked open IDE button" }
  | { name: "Changed tab"; tab: string };

export const useSpawnAnalytics = () =>
  useAnalyticsRoot<Action, AnalyticsIdentifier>("SpawnPages");
