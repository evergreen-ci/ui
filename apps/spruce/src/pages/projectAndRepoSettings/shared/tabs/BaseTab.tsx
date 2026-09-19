import { useParams } from "react-router-dom";
import { Form } from "components/Settings/Form";
import { GetFormSchema, ValidateProps } from "components/SpruceForm";
import { slugs } from "constants/routes";
import { useHasProjectOrRepoEditPermission } from "hooks";
import { usePopulateForm, useProjectSettingsContext } from "../Context";
import { FormStateMap, WritableProjectSettingsType } from "./types";

type BaseTabProps<T extends WritableProjectSettingsType> = {
  disabled?: boolean;
  initialFormState: FormStateMap[T];
  formSchema: ReturnType<GetFormSchema>;
  tab: T;
  customValidate?: ValidateProps<FormStateMap[T]>;
};

export const BaseTab = <T extends WritableProjectSettingsType>({
  disabled,
  initialFormState,
  tab,
  ...rest
}: BaseTabProps<T>) => {
  const {
    [slugs.projectIdentifier]: projectIdentifier,
    [slugs.repoId]: repoId,
  } = useParams<{
    [slugs.projectIdentifier]: string;
    [slugs.repoId]: string;
  }>();

  const state = useProjectSettingsContext();
  usePopulateForm(initialFormState, tab);

  const { canEdit, loading } = useHasProjectOrRepoEditPermission(
    projectIdentifier,
    repoId,
  );

  return loading ? null : (
    <Form<T, FormStateMap>
      {...rest}
      disabled={disabled || !canEdit}
      state={
        state as unknown as Parameters<typeof Form<T, FormStateMap>>[0]["state"]
      }
      tab={tab}
    />
  );
};
