import { useCallback, useContext, useMemo, useRef } from "react";
import { AjvError } from "@rjsf/core";
import {
  createSettingsContext,
  getUseHasUnsavedTab,
  getUsePopulateForm,
  SettingsState,
  useSettingsState,
} from "components/Settings/Context";
import { SpruceFormRef } from "components/SpruceForm";
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

  const formRefsMap = useRef<
    Partial<Record<WritableAdminSettingsType, SpruceFormRef>>
  >({});

  const setFormRef = useCallback(
    (tab: WritableAdminSettingsType, ref: SpruceFormRef | null) => {
      if (ref) {
        formRefsMap.current[tab] = ref;
      } else {
        delete formRefsMap.current[tab];
      }
    },
    [],
  );

  const validateTabs = useCallback(
    (
      tabsToValidate: WritableAdminSettingsType[],
    ): { errors: AjvError[]; isValid: boolean } => {
      const allErrors = tabsToValidate.flatMap((tab) => {
        const formRef = formRefsMap.current[tab];
        if (!formRef) return [];
        const { formData } = getTab(tab);
        const { errorSchema, errors } = formRef.validate(formData);
        if (errors.length > 0) {
          // Set RJSF's internal error state to show inline field errors.
          formRef.setState({ errors, errorSchema });
        }
        return errors;
      });
      return { errors: allErrors, isValid: allErrors.length === 0 };
    },
    [getTab],
  );

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
      setFormRef,
      setInitialData,
      tabs,
      updateForm,
      validateTabs,
      checkHasUnsavedChanges,
      getChangedTabs,
    }),
    [
      getTab,
      saveTab,
      setFormRef,
      setInitialData,
      tabs,
      updateForm,
      validateTabs,
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
  setFormRef: (
    tab: WritableAdminSettingsType,
    ref: SpruceFormRef | null,
  ) => void;
  validateTabs: (tabs: WritableAdminSettingsType[]) => {
    errors: AjvError[];
    isValid: boolean;
  };
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
