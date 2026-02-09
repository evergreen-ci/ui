import { Form } from "components/Settings/Form";
import { GetFormSchema, ValidateProps } from "components/SpruceForm";
import { usePopulateForm, useAdminSettingsContext } from "../Context";
import { FormStateMap, FormStates, WritableAdminSettingsType } from "./types";

type BaseTabProps<T extends WritableAdminSettingsType> = {
  disabled?: boolean;
  formSchema: ReturnType<GetFormSchema>;
  initialFormState: FormStates;
  tab: T;
  validate?: ValidateProps<FormStates>;
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
      liveValidate={false}
      state={state}
      tab={tab}
    />
  );
};
