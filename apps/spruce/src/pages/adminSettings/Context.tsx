import { useContext, useMemo, useCallback } from "react";
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
  WritableAdminSettingsTabs,
  WritableAdminSettingsType,
} from "./tabs/types";

const routes = Object.values(WritableAdminSettingsTabs);

const AdminSettingsContext = createSettingsContext<
  WritableAdminSettingsType,
  FormStateMap
>();

const AdminSettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { getTab, saveTab, setInitialData, tabs, updateForm } =
    useSettingsState(routes, formToGqlMap);

  const checkHasUnsavedChanges = useCallback(
    (): boolean => Object.values(tabs).some((tab) => tab.hasChanges),
    [tabs],
  );

  const getChangedTabs = useCallback(
    (): WritableAdminSettingsType[] =>
      Object.entries(tabs)
        .filter(([, state]) => state.hasChanges)
        .map(([key]) => key as WritableAdminSettingsType),
    [tabs],
  );

  const contextValue = useMemo(
    () => ({
      getTab,
      saveTab,
      setInitialData,
      tabs,
      updateForm,
      checkHasUnsavedChanges,
      getChangedTabs,
    }),
    [
      getTab,
      saveTab,
      setInitialData,
      tabs,
      updateForm,
      checkHasUnsavedChanges,
      getChangedTabs,
    ],
  );

  return (
    <AdminSettingsContext.Provider value={contextValue}>
      {children}
    </AdminSettingsContext.Provider>
  );
};

type AdminSettingsContextType = SettingsState<
  WritableAdminSettingsType,
  FormStateMap
> & {
  checkHasUnsavedChanges: () => boolean;
  getChangedTabs: () => WritableAdminSettingsType[];
};

export const useAdminSettingsContext = (): AdminSettingsContextType => {
  const context = useContext(AdminSettingsContext);
  if (context === undefined || context === null) {
    throw new Error(
      "useAdminSettingsContext must be used within AdminSettingsProvider",
    );
  }

  return context as AdminSettingsContextType;
};

// @ts-expect-error: The type definitions for getUseHasUnsavedTab do not align with AdminSettingsContext.
export const useHasUnsavedTab = getUseHasUnsavedTab(AdminSettingsContext);
// @ts-expect-error: The type definitions for getUseHasUnsavedTab do not align with AdminSettingsContext.
export const usePopulateForm = getUsePopulateForm(AdminSettingsContext);

export { AdminSettingsProvider };
