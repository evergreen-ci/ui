import { useAnalyticsRoot } from "@evg-ui/lib/analytics/hooks";
import { AnalyticsIdentifier } from "analytics/types";

type Action =
  | { name: "Clicked copy SSH command button" }
  | { name: "Changed host status"; "host.status": string }
  | { name: "Toggled spawn host details panel"; expanded: boolean }
  | { name: "Viewed spawn host modal" }
  | {
      name: "Viewed edit spawn host modal";
      "host.id": string;
      "host.status": string;
    }
  | {
      name: "Changed spawn host settings";
    }
  | {
      name: "Created a spawn host";
      "host.is.volume.migration": boolean;
      "host.is.workstation": boolean;
      "host.distro.id": string;
      "host.is.unexpirable": boolean;
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
      "volume.is.unexpirable": boolean;
    }
  | {
      name: "Changed spawn volume settings";
      "volume.is.unexpirable": boolean;
    }
  | { name: "Clicked open IDE button" }
  | { name: "Changed tab"; tab: string };

export const useSpawnAnalytics = () =>
  useAnalyticsRoot<Action, AnalyticsIdentifier>("SpawnPages");
