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
  if (context === undefined) {
    throw new Error(
      "useAdminSettingsContext must be used within a AdminSettingsProvider",
    );
  }
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  return context;
};

// @ts-expect-error: FIXME. This comment was added by an automated script.
const useHasUnsavedTab = getUseHasUnsavedTab(AdminSettingsContext);
// @ts-expect-error: FIXME. This comment was added by an automated script.
const usePopulateForm = getUsePopulateForm(AdminSettingsContext);

export {
  AdminSettingsProvider,
  useAdminSettingsContext,
  useHasUnsavedTab,
  usePopulateForm,
};
