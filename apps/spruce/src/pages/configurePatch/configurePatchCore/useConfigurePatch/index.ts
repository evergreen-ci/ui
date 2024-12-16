import { useEffect, useReducer } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPatchRoute, slugs } from "constants/routes";
import { ConfigurePatchQuery, ParameterInput } from "gql/generated/types";
import { useTabShortcut } from "hooks/useTabShortcut";
import { ConfigurePatchPageTabs } from "types/patch";
import { indexToTabMap, tabToIndexMap } from "./constants";
import { ConfigurePatchState, initialState, reducer } from "./state";
import { AliasState, VariantTasksState } from "./types";
import { initializeAliasState, initializeTaskState } from "./utils";

interface HookResult extends ConfigurePatchState {
  setDescription: (description: string) => void;
  setPatchParams: (patchParams: ParameterInput[]) => void;
  setSelectedBuildVariants: (variants: string[]) => void;
  setSelectedBuildVariantTasks: (variantTasks: VariantTasksState) => void;
  setSelectedAliases: (aliases: AliasState) => void;
  setSelectedTab: (tab: ConfigurePatchPageTabs) => void;
}

const useConfigurePatch = (patch: ConfigurePatchQuery["patch"]): HookResult => {
  const navigate = useNavigate();
  const { [slugs.tab]: urlTab } = useParams<{
    [slugs.tab]: ConfigurePatchPageTabs;
  }>();

  const { id, project } = patch || {};
  const { variants } = project || {};
  const [state, dispatch] = useReducer(
    reducer,
    initialState({
      selectedTab: urlTab || ConfigurePatchPageTabs.Tasks,
    }),
  );

  // Update the URL when the selected tab changes
  useEffect(() => {
    navigate(
      getPatchRoute(id, {
        configure: true,
        tab: state.selectedTab,
      }),
      { replace: true },
    );
  }, [state.selectedTab]); // eslint-disable-line react-hooks/exhaustive-deps

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
  const setSelectedTab = (t: ConfigurePatchPageTabs) => {
    dispatch({ type: "setSelectedTab", tab: t });
  };
  const setPatchParams = (params: ParameterInput[]) =>
    dispatch({ type: "setPatchParams", params });

  useTabShortcut({
    currentTab: tabToIndexMap[state.selectedTab],
    numTabs: indexToTabMap.length,
    setSelectedTab: (i: number) => setSelectedTab(indexToTabMap[i]),
  });

  return {
    ...state,
    setDescription,
    setPatchParams,
    setSelectedAliases,
    setSelectedBuildVariants,
    setSelectedBuildVariantTasks,
    setSelectedTab,
  };
};

export default useConfigurePatch;
