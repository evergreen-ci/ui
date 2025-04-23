import React, { useContext, useMemo } from "react";
import {
  createSettingsContext,
  getUseHasUnsavedTab,
  getUsePopulateForm,
  SettingsState,
  useSettingsState,
} from "components/Settings/Context";
import { formToGqlMap } from "pages/projectSettings/tabs/transformers";
import {
  FormStateMap,
  WritableProjectSettingsTabs,
  WritableProjectSettingsType,
} from "pages/projectSettings/tabs/types";

const routes = Object.values(WritableProjectSettingsTabs);
const NewSettingsContext = createSettingsContext<
  WritableProjectSettingsType,
  FormStateMap
>();

const NewSettingsProvider: React.FC<{ children: React.ReactNode }> = ({
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
    <NewSettingsContext.Provider value={contextValue}>
      {children}
    </NewSettingsContext.Provider>
  );
};

const useNewSettingsContext = (): SettingsState<
  WritableProjectSettingsType,
  FormStateMap
> => {
  const context = useContext(NewSettingsContext);
  if (context === undefined || context === null) {
    throw new Error(
      "useNewSettingsContext must be used within a NewSettingsProvider",
    );
  }
  return context;
};

const useHasUnsavedTab = getUseHasUnsavedTab(NewSettingsContext);
const usePopulateForm = getUsePopulateForm(NewSettingsContext);

export {
  NewSettingsProvider,
  useHasUnsavedTab,
  usePopulateForm,
  useNewSettingsContext,
};
