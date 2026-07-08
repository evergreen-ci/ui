import { Unpacked } from "@evg-ui/lib/types/utils";
import { VersionTasksQuery } from "gql/generated/types";

type Task = Unpacked<VersionTasksQuery["version"]["tasks"]["data"]>;

export type TaskTableInfo = Pick<
  Task,
  | "id"
  | "baseTask"
  | "buildVariant"
  | "buildVariantDisplayName"
  | "dependsOn"
  | "displayName"
  | "displayStatus"
  | "execution"
  | "executionTasksFull"
  | "project"
  | "reviewed"
  | "errors"
>;
