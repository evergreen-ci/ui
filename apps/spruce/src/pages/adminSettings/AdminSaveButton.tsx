import { useMutation } from "@apollo/client";
import Button from "@leafygreen-ui/button";
import {
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

  const [saveAdminSettings] = useMutation<
    SaveAdminSettingsMutation,
    SaveAdminSettingsMutationVariables
  >(SAVE_ADMIN_SETTINGS, {});

  const handleSave = () => {
    const changedTabs = getChangedTabs();
    console.log("Saving changes...", changedTabs);

    const changedSettings = changedTabs.reduce(
      (acc, tab) => {
        if (Object.prototype.hasOwnProperty.call(formToGqlMap, tab)) {
          const { formData } = getTab(tab);
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          const formToGql: FormToGqlFunction<typeof tab> = formToGqlMap[tab];
          const changes = formToGql(formData);
          return { ...acc, ...changes };
        }
        return acc;
      },
      {} as SaveAdminSettingsMutationVariables["adminSettings"],
    );
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
      variant="primary"
    >
      Save changes on page
    </Button>
  );
};

export default AdminSaveButton;
