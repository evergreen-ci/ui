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
  validate?: ValidateProps<FormStateMap[T]>;
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
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    <Form<WritableProjectSettingsType, FormStateMap>
      {...rest}
      disabled={disabled || !canEdit}
      state={state}
      tab={tab}
    />
  );
};
