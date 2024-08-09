import { useAnalyticsRoot } from "@evg-ui/lib/analytics/hooks";
import { AnalyticsIdentifier } from "analytics/types";
import {
  EditSpawnHostMutationVariables,
  SpawnHostMutationVariables,
  SpawnVolumeMutationVariables,
  UpdateVolumeMutationVariables,
} from "gql/generated/types";

type Action =
  | { name: "Clicked copy SSH command button" }
  | { name: "Changed host status"; status: string }
  | { name: "Toggled spawn host details panel"; expanded: boolean }
  | { name: "Viewed spawn host modal" }
  | { name: "Viewed edit spawn host modal"; hostId: string; status: string }
  | {
      name: "Changed spawn host settings";
      params: EditSpawnHostMutationVariables;
    }
  | {
      name: "Created a spawn host";
      isMigration: boolean;
      params: Omit<
        SpawnHostMutationVariables["spawnHostInput"],
        "publicKey" | "userDataScript" | "setUpScript"
      >;
    }
  | { name: "Viewed spawn volume modal" }
  | { name: "Changed mounted volume on host"; volumeId: string; hostId: string }
  | { name: "Deleted a volume"; volumeId: string }
  | { name: "Changed unmounted volume on host"; volumeId: string }
  | {
      name: "Created a volume";
      params: SpawnVolumeMutationVariables["spawnVolumeInput"];
    }
  | {
      name: "Changed spawn volume settings";
      params: UpdateVolumeMutationVariables["updateVolumeInput"];
    }
  | { name: "Clicked open IDE button" }
  | { name: "Changed tab"; tab: string };

export const useSpawnAnalytics = () =>
  useAnalyticsRoot<Action, AnalyticsIdentifier>("SpawnPages");
