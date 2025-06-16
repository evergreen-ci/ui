import { useMutation } from "@apollo/client";
import Button, { Variant as ButtonVariant } from "@leafygreen-ui/button";

import { useToastContext } from "@evg-ui/lib/context/toast";
import {
  AdminSettingsInput,
  SaveAdminSettingsMutation,
  SaveAdminSettingsMutationVariables,
} from "gql/generated/types";
import { SAVE_ADMIN_SETTINGS } from "gql/mutations";
import { useAdminSettingsContext } from "./Context";
import { formToGqlMap } from "./tabs/transformers";
import { FormToGqlFunction } from "./tabs/types";

export const AdminSaveButton = () => {
  const { checkHasUnsavedChanges, getChangedTabs, getTab } =
    useAdminSettingsContext();
  const hasUnsavedChanges = checkHasUnsavedChanges();
  const dispatchToast = useToastContext();

  const [saveAdminSettings] = useMutation<
    SaveAdminSettingsMutation,
    SaveAdminSettingsMutationVariables
  >(SAVE_ADMIN_SETTINGS, {
    onCompleted: () => {
      dispatchToast.success("Settings saved successfully");
    },
    onError: (err) => {
      dispatchToast.error(`Error saving settings: ${err.message}`);
    },
  });

  const handleSave = () => {
    const changedTabs = getChangedTabs();

    const changedSettings = changedTabs.reduce((acc, tab) => {
      if (Object.prototype.hasOwnProperty.call(formToGqlMap, tab)) {
        const { formData } = getTab(tab);
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        const formToGql: FormToGqlFunction<typeof tab> = formToGqlMap[tab];
        const changes = formToGql(formData);
        return { ...acc, ...changes };
      }
      return acc;
    }, {} as AdminSettingsInput);
    saveAdminSettings({
      variables: {
        adminSettings: changedSettings,
      },
    });
  };

  return (
    <Button
      data-cy="save-settings-button"
      disabled={!hasUnsavedChanges}
      onClick={handleSave}
      style={{ alignSelf: "flex-end" }}
      variant={ButtonVariant.Primary}
    >
      Save changes on page
    </Button>
  );
};

export default AdminSaveButton;
