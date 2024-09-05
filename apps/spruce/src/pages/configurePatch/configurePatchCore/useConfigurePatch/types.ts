import { Unpacked } from "@evg-ui/lib/types/utils";
import { ConfigurePatchQuery } from "gql/generated/types";

// Extract the type of a child patch and append alias field
export interface ChildPatchAliased
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  extends Unpacked<ConfigurePatchQuery["patch"]["childPatches"]> {
  alias: string;
}

export type PatchTriggerAlias = Unpacked<
  ConfigurePatchQuery["patch"]["patchTriggerAliases"]
>;

export type AliasState = {
  [alias: string]: boolean;
};
export type TasksState = {
  [task: string]: boolean;
};
export type VariantTasksState = {
  [variant: string]: TasksState;
};
