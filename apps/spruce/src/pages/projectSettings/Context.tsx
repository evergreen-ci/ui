import { useContext, useMemo } from "react";
import {
  createSettingsContext,
  getUseHasUnsavedTab,
  getUsePopulateForm,
  SettingsState,
  useSettingsState,
} from "components/Settings/Context";
import { formToGqlMap } from "./tabs/transformers";
import {
  FormStateMap,
  WritableProjectSettingsTabs,
  WritableProjectSettingsType,
} from "./tabs/types";

const routes = Object.values(WritableProjectSettingsTabs);
const ProjectSettingsContext = createSettingsContext<
  WritableProjectSettingsType,
  FormStateMap
>();

const ProjectSettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { getTab, saveTab, setInitialData, tabs, updateForm } =
    useSettingsState(routes, formToGqlMap);

  const contextValue = useMemo(
    () => ({
      getTab,
      saveTab,
      setInitialData,
      tabs,
      updateForm,
    }),
    [getTab, saveTab, setInitialData, tabs, updateForm],
  );

  return (
    <ProjectSettingsContext.Provider value={contextValue}>
      {children}
    </ProjectSettingsContext.Provider>
  );
};

const useProjectSettingsContext = (): SettingsState<
  WritableProjectSettingsType,
  FormStateMap
> => {
  const context = useContext(ProjectSettingsContext);
  if (context === undefined) {
    throw new Error(
      "useProjectSettingsContext must be used within a ProjectSettingsProvider",
    );
  }
  // @ts-ignore: FIXME. This comment was added by an automated script.
  return context;
};

// @ts-ignore: FIXME. This comment was added by an automated script.
const useHasUnsavedTab = getUseHasUnsavedTab(ProjectSettingsContext);
// @ts-ignore: FIXME. This comment was added by an automated script.
const usePopulateForm = getUsePopulateForm(ProjectSettingsContext);

export {
  ProjectSettingsProvider,
  useHasUnsavedTab,
  usePopulateForm,
  useProjectSettingsContext,
};
