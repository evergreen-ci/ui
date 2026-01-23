import { Unpacked } from "@evg-ui/lib/types/utils";
import { ConfigurePatchQuery } from "gql/generated/types";

type PatchQuery = ConfigurePatchQuery["patch"];
// Extract the type of a child patch and append alias field
export interface ChildPatchAliased extends Unpacked<
  NonNullable<PatchQuery["childPatches"]>
> {
  alias: string;
}

export type PatchTriggerAlias = Unpacked<PatchQuery["patchTriggerAliases"]>;

export type AliasState = {
  [alias: string]: boolean;
};
export type TasksState = {
  [task: string]: boolean;
};
export type VariantTasksState = {
  [variant: string]: TasksState;
};
