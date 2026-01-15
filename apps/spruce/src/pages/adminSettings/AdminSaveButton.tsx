import { useMutation } from "@apollo/client/react";
import Button, { Variant as ButtonVariant } from "@leafygreen-ui/button";
import { useParams } from "react-router-dom";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { AdminSettingsTabRoutes, slugs } from "constants/routes";
import {
  AdminSettings,
  AdminSettingsInput,
  SaveAdminSettingsMutation,
  SaveAdminSettingsMutationVariables,
} from "gql/generated/types";
import { SAVE_ADMIN_SETTINGS } from "gql/mutations";
import { useAdminSettingsContext } from "./Context";
import { formToGqlMap } from "./tabs/transformers";

interface AdminSaveButtonProps {
  adminSettingsData: AdminSettings;
}

export const AdminSaveButton: React.FC<AdminSaveButtonProps> = ({
  adminSettingsData,
}) => {
  const { [slugs.tab]: urlTab } = useParams<{
    [slugs.tab]: AdminSettingsTabRoutes;
  }>();

  const {
    checkHasUnsavedChanges,
    getChangedTabs,
    getTab,
    saveTab,
    setInitialData,
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
      setInitialData(
        changedTabs.reduce(
          (acc, tab) => {
            const { formData } = getTab(tab);
            return { ...acc, [tab]: formData };
          },
          {} as Record<string, any>,
        ),
      );
      dispatchToast.success("Settings saved successfully");
    },
    onError: (err) => {
      dispatchToast.error(`Error saving settings: ${err.message}`);
    },
  });

  const handleSave = () => {
    const changedSettings = changedTabs.reduce((acc, tab) => {
      const formToGql = formToGqlMap[tab];
      if (formToGql) {
        const { formData } = getTab(tab);
        const changes = formToGql(formData as any, adminSettingsData);
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
