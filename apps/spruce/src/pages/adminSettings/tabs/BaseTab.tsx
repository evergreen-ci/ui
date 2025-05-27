import { Form } from "components/Settings/Form";
import { GetFormSchema, ValidateProps } from "components/SpruceForm";
import { usePopulateForm, useAdminSettingsContext } from "../Context";
import { FormStateMap, WritableAdminSettingsType } from "./types";

type BaseTabProps<T extends WritableAdminSettingsType> = {
  disabled?: boolean;
  formSchema: ReturnType<GetFormSchema>;
  initialFormState: FormStateMap[T];
  tab: T;
  validate?: ValidateProps<FormStateMap[T]>;
};

export const BaseTab = <T extends WritableAdminSettingsType>({
  disabled,
  formSchema,
  initialFormState,
  tab,
  ...rest
}: BaseTabProps<T>) => {
  const state = useAdminSettingsContext();
  usePopulateForm(initialFormState, tab);

  return (
    // @ts-expect-error: Suppressing type error as per PR #790 review comments
    <Form<WritableAdminSettingsType, FormStateMap>
      {...rest}
      disabled={disabled}
      formSchema={formSchema}
      state={state}
      tab={tab}
    />
  );
};
