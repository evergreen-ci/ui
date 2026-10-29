import { Unpacked } from "@evg-ui/lib/types/utils";
import { VersionTaskDurationsQuery } from "gql/generated/types";

export type TaskDurationData = Unpacked<
  VersionTaskDurationsQuery["version"]["tasks"]["data"]
>;
