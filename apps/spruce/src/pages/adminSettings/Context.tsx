import { Context, useContext, useMemo } from "react";
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
>() as Context<SettingsState<WritableAdminSettingsType, FormStateMap>>;

const AdminSettingsProvider: React.FC<{ children: React.ReactNode }> = ({
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
    <AdminSettingsContext.Provider value={contextValue}>
      {children}
    </AdminSettingsContext.Provider>
  );
};

const useAdminSettingsContext = (): SettingsState<
  WritableAdminSettingsType,
  FormStateMap
> => {
  const context = useContext(AdminSettingsContext);
  if (context === undefined || context === null) {
    throw new Error(
      "useAdminSettingsContext must be used within a AdminSettingsProvider",
    );
  }
  return context;
};

const useHasUnsavedTab = getUseHasUnsavedTab(AdminSettingsContext);

const usePopulateForm = getUsePopulateForm(AdminSettingsContext);

export {
  AdminSettingsProvider,
  useAdminSettingsContext,
  useHasUnsavedTab,
  usePopulateForm,
};
