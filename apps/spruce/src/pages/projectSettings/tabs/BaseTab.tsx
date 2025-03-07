import { useParams } from "react-router";
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
  const { [slugs.projectIdentifier]: id } = useParams<{
    [slugs.projectIdentifier]: string;
  }>();

  const state = useProjectSettingsContext();
  usePopulateForm(initialFormState, tab);

  const { canEdit, loading } = useHasProjectOrRepoEditPermission(id);

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
