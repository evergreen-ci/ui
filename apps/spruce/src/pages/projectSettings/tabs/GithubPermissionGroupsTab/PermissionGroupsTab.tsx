import { useMemo } from "react";
import { ValidateProps } from "components/SpruceForm";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { BaseTab } from "../BaseTab";
import { findDuplicateIndices } from "../utils";
import { getFormSchema } from "./getFormSchema";
import { PermissionGroupsFormState, TabProps } from "./types";

const tab = ProjectSettingsTabRoutes.GithubPermissionGroups;

export const PermissionGroupsTab: React.FC<TabProps> = ({ projectData }) => {
  const initialFormState = projectData;

  const formSchema = useMemo(() => getFormSchema(), []);

  return (
    <BaseTab
      initialFormState={initialFormState}
      formSchema={formSchema}
      tab={tab}
      validate={validate}
    />
  );
};

/* Display an error and prevent saving if a user enters a duplicate GitHub permission. */
const validate = ((formData, errors) => {
  formData.permissionGroups.forEach((p, idx) => {
    const duplicateIndices = findDuplicateIndices(p.permissions, "type");
    duplicateIndices.forEach((i) => {
      errors.permissionGroups?.[idx]?.permissions?.[i]?.type?.addError(
        "Duplicate types are not allowed.",
      );
    });
  });
  return errors;
}) satisfies ValidateProps<PermissionGroupsFormState>;
