import { useEffect, useReducer } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { getPatchRoute, slugs } from "constants/routes";
import { ConfigurePatchQuery, ParameterInput } from "gql/generated/types";
import { useTabShortcut } from "hooks/useTabShortcut";
import { ConfigurePatchPageTabs } from "types/patch";
import { parseQueryString } from "utils/queryString";
import { ConfigurePatchState, initialState, reducer } from "./state";
import { AliasState, VariantTasksState } from "./types";
import { initializeAliasState, initializeTaskState } from "./utils";

const indexToTabMap = [
  ConfigurePatchPageTabs.Tasks,
  ConfigurePatchPageTabs.Changes,
  ConfigurePatchPageTabs.Parameters,
];

const tabToIndexMap = {
  [ConfigurePatchPageTabs.Tasks]: 0,
  [ConfigurePatchPageTabs.Changes]: 1,
  [ConfigurePatchPageTabs.Parameters]: 2,
};

interface HookResult extends ConfigurePatchState {
  setDescription: (description: string) => void;
  setPatchParams: (patchParams: ParameterInput[]) => void;
  setSelectedBuildVariants: (variants: string[]) => void;
  setSelectedBuildVariantTasks: (variantTasks: VariantTasksState) => void;
  setSelectedAliases: (aliases: AliasState) => void;
  setSelectedTab: React.Dispatch<React.SetStateAction<number>>;
}

const useConfigurePatch = (patch: ConfigurePatchQuery["patch"]): HookResult => {
  const navigate = useNavigate();
  const location = useLocation();
  const { [slugs.tab]: tab } = useParams<{
    [slugs.tab]: ConfigurePatchPageTabs;
  }>();

  const { id, project } = patch || {};
  const { variants } = project || {};
  const [state, dispatch] = useReducer(
    reducer,
    initialState({
      selectedTab: tabToIndexMap[tab || ConfigurePatchPageTabs.Tasks],
      selectedTabName: tab,
    }),
  );

  const { selectedTab } = state;

  useEffect(() => {
    const query = parseQueryString(location.search);
    navigate(
      getPatchRoute(id, {
        configure: true,
        tab: indexToTabMap[selectedTab],
        ...query,
      }),
      { replace: true },
    );
  }, [selectedTab]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (patch) {
      dispatch({
        type: "updatePatchData",
        description: patch.description,
        // @ts-expect-error
        buildVariants: [variants[0]?.name],
        params: patch.parameters,
        // @ts-expect-error
        variantTasks: initializeTaskState(variants, patch.variantsTasks),
        aliases: initializeAliasState(patch.patchTriggerAliases),
      });
    }
  }, [patch, variants]);

  const setDescription = (description: string) =>
    dispatch({ type: "setDescription", description });
  const setSelectedBuildVariants = (buildVariants: string[]) =>
    dispatch({ type: "setSelectedBuildVariants", buildVariants });
  const setSelectedBuildVariantTasks = (variantTasks: VariantTasksState) =>
    dispatch({
      type: "setSelectedBuildVariantTasks",
      variantTasks,
    });
  const setSelectedAliases = (aliases: AliasState) =>
    dispatch({
      type: "setSelectedAliases",
      aliases,
    });
  const setSelectedTab = (i: number) =>
    dispatch({ type: "setSelectedTab", tabIndex: i });
  const setPatchParams = (params: ParameterInput[]) =>
    dispatch({ type: "setPatchParams", params });

  useTabShortcut({
    currentTab: selectedTab,
    numTabs: indexToTabMap.length,
    setSelectedTab,
  });

  return {
    ...state,
    setDescription,
    setPatchParams,
    setSelectedAliases,
    setSelectedBuildVariants,
    setSelectedBuildVariantTasks,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    setSelectedTab,
  };
};

export default useConfigurePatch;
