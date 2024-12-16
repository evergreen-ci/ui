import { ParameterInput } from "gql/generated/types";
import { ConfigurePatchPageTabs } from "types/patch";
import { omitTypename } from "utils/string";
import { AliasState, VariantTasksState } from "./types";

type ConfigurePatchState = {
  description: string;
  selectedAliases: AliasState;
  selectedBuildVariants: string[];
  selectedBuildVariantTasks: VariantTasksState;
  patchParams: ParameterInput[];
  selectedTab: number;
  selectedTabName?: ConfigurePatchPageTabs;
  disableBuildVariantSelect: boolean;
};

type Action =
  | { type: "setDescription"; description: string }
  | { type: "setSelectedBuildVariants"; buildVariants: string[] }
  | { type: "setPatchParams"; params: ParameterInput[] }
  | { type: "setSelectedBuildVariantTasks"; variantTasks: VariantTasksState }
  | { type: "setSelectedTab"; tabIndex: number; tab?: ConfigurePatchPageTabs }
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
  selectedTab = 0,
  selectedTabName = ConfigurePatchPageTabs.Tasks,
}: {
  selectedTab: number;
  selectedTabName?: ConfigurePatchPageTabs;
}): ConfigurePatchState => ({
  description: "",
  selectedAliases: {},
  selectedBuildVariants: [],
  selectedBuildVariantTasks: {},
  patchParams: [],
  selectedTab,
  selectedTabName,
  disableBuildVariantSelect:
    indexToTabMap[selectedTab] === ConfigurePatchPageTabs.Tasks,
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
      let tab = indexToTabMap.indexOf(ConfigurePatchPageTabs.Tasks);
      if (action.tabIndex !== -1 && action.tabIndex < indexToTabMap.length) {
        tab = action.tabIndex;
      }
      return {
        ...state,
        selectedTab: tab,
        selectedTabName: action.tab,
        disableBuildVariantSelect:
          indexToTabMap[action.tabIndex] !== ConfigurePatchPageTabs.Tasks,
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

const indexToTabMap = [
  ConfigurePatchPageTabs.Tasks,
  ConfigurePatchPageTabs.Changes,
  ConfigurePatchPageTabs.Parameters,
];

export type { ConfigurePatchState };
export { reducer, initialState };
