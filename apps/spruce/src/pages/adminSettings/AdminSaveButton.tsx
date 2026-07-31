import { useMutation, useQuery } from "@apollo/client/react";
import { Button, Variant as ButtonVariant } from "@leafygreen-ui/button";
import { useParams } from "react-router-dom";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { AdminSettingsTabRoutes, slugs } from "constants/routes";
import {
  AdminSettingsInput,
  AdminSettingsQuery,
  AdminSettingsQueryVariables,
  SaveAdminSettingsMutation,
  SaveAdminSettingsMutationVariables,
} from "gql/generated/types";
import { SAVE_ADMIN_SETTINGS } from "gql/mutations";
import { ADMIN_SETTINGS } from "gql/queries";
import { useAdminSettingsContext } from "./Context";
import { formToGqlMap } from "./tabs/transformers";
import { AnyFormToGqlFunction } from "./tabs/types";

export const AdminSaveButton: React.FC = () => {
  const { [slugs.tab]: urlTab } = useParams<{
    [slugs.tab]: AdminSettingsTabRoutes;
  }>();

  // Get the initial data, which should be cached
  const { data } = useQuery<AdminSettingsQuery, AdminSettingsQueryVariables>(
    ADMIN_SETTINGS,
  );
  const adminSettingsData = data?.adminSettings;

  const {
    checkHasUnsavedChanges,
    getChangedTabs,
    getTab,
    saveTab,
    validateTabs,
  } = useAdminSettingsContext();
  const changedTabs = getChangedTabs();
  const hasUnsavedChanges = checkHasUnsavedChanges();
  const dispatchToast = useToastContext();

  const [saveAdminSettings, { loading }] = useMutation<
    SaveAdminSettingsMutation,
    SaveAdminSettingsMutationVariables
  >(SAVE_ADMIN_SETTINGS, {
    onCompleted: () => {
      changedTabs.forEach((t) => saveTab(t));
      dispatchToast.success("Settings saved successfully");
    },
    onError: (err) => {
      dispatchToast.error(`Error saving settings: ${err.message}`);
    },
    awaitRefetchQueries: true,
    refetchQueries: ["AdminSettings"],
  });

  const handleSave = () => {
    if (!adminSettingsData) {
      return;
    }
    const { errors, isValid } = validateTabs(changedTabs);
    if (!isValid) {
      const fieldNames = [
        ...new Set(errors.map((e) => e.property.split(".").pop())),
      ].join(", ");
      dispatchToast.error(
        `Please fix errors in the following fields: ${fieldNames}`,
        true,
        { shouldTimeout: false },
      );
      return;
    }

    const changedSettings = changedTabs.reduce((acc, tab) => {
      const formToGql = formToGqlMap[tab];
      if (formToGql) {
        const { formData } = getTab(tab);
        const changes = (formToGql as AnyFormToGqlFunction)(
          formData,
          adminSettingsData,
        );
        return { ...acc, ...changes };
      }
      return acc;
    }, {} as AdminSettingsInput);
    saveAdminSettings({ variables: { adminSettings: changedSettings } });
  };

  const saveable =
    urlTab !== AdminSettingsTabRoutes.RestartTasks &&
    urlTab !== AdminSettingsTabRoutes.EventLog;

  return saveable ? (
    <Button
      data-cy="save-settings-button"
      disabled={!hasUnsavedChanges || loading}
      isLoading={loading}
      onClick={handleSave}
      style={{ alignSelf: "flex-end" }}
      variant={ButtonVariant.Primary}
    >
      Save changes on page
    </Button>
  ) : null;
};

export default AdminSaveButton;
