import { ParameterInput } from "gql/generated/types";
import { ConfigurePatchPageTabs } from "types/patch";
import { omitTypename } from "utils/object";
import { AliasState, VariantTasksState } from "./types";

type ConfigurePatchState = {
  description: string;
  selectedAliases: AliasState;
  selectedBuildVariants: string[];
  selectedBuildVariantTasks: VariantTasksState;
  patchParams: ParameterInput[];
  selectedTab: ConfigurePatchPageTabs;
  disableBuildVariantSelect: boolean;
};

type Action =
  | { type: "setDescription"; description: string }
  | { type: "setSelectedBuildVariants"; buildVariants: string[] }
  | { type: "setPatchParams"; params: ParameterInput[] }
  | { type: "setSelectedBuildVariantTasks"; variantTasks: VariantTasksState }
  | { type: "setSelectedTab"; tab: ConfigurePatchPageTabs }
  | {
      type: "updatePatchData";
      description: string;
      buildVariants: string[];
      params: ParameterInput[];
      variantTasks: VariantTasksState;
      aliases: AliasState;
    }
  | {
      type: "setSelectedAliases";
      aliases: AliasState;
    };

const initialState = ({
  selectedTab = ConfigurePatchPageTabs.Tasks,
}: {
  selectedTab: ConfigurePatchPageTabs;
}): ConfigurePatchState => ({
  description: "",
  selectedAliases: {},
  selectedBuildVariants: [],
  selectedBuildVariantTasks: {},
  patchParams: [],
  selectedTab,
  disableBuildVariantSelect: selectedTab !== ConfigurePatchPageTabs.Tasks,
});

const reducer = (
  state: ConfigurePatchState,
  action: Action,
): ConfigurePatchState => {
  switch (action.type) {
    case "setDescription":
      return {
        ...state,
        description: action.description,
      };
    case "setSelectedBuildVariants":
      return {
        ...state,
        selectedBuildVariants: action.buildVariants.sort((a, b) =>
          b.localeCompare(a),
        ),
      };
    case "setSelectedBuildVariantTasks":
      return {
        ...state,
        selectedBuildVariantTasks: action.variantTasks,
      };
    case "setSelectedAliases":
      return {
        ...state,
        selectedAliases: action.aliases,
      };
    case "setPatchParams":
      return {
        ...state,
        patchParams: omitTypename(action.params),
      };
    case "setSelectedTab": {
      return {
        ...state,
        selectedTab: action.tab,
        disableBuildVariantSelect: action.tab !== ConfigurePatchPageTabs.Tasks,
      };
    }
    case "updatePatchData":
      return {
        ...state,
        description: action.description,
        selectedBuildVariants: action.buildVariants,
        patchParams: omitTypename(action.params),
        selectedBuildVariantTasks: action.variantTasks,
        selectedAliases: action.aliases,
      };

    default:
      throw new Error("Unknown action type");
  }
};

export type { ConfigurePatchState };
export { reducer, initialState };
