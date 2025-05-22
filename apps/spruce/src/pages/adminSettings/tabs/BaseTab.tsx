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
  initialFormState,
  tab,
  ...rest
}: BaseTabProps<T>) => {
  const state = useAdminSettingsContext();
  usePopulateForm(initialFormState, tab);

  return (
    <Form<WritableAdminSettingsType, FormStateMap>
      {...rest}
      state={state}
      tab={tab}
      validate={
        rest.validate as
          | ValidateProps<FormStateMap[keyof FormStateMap]>
          | undefined
      }
    />
  );
};
