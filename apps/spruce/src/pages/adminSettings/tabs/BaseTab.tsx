import { useCallback } from "react";
import { Form } from "components/Settings/Form";
import {
  GetFormSchema,
  SpruceFormRef,
  ValidateProps,
} from "components/SpruceForm";
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
  const { setFormRef } = state;
  usePopulateForm(initialFormState, tab);

  const formRef = useCallback(
    (ref: SpruceFormRef | null) => {
      setFormRef(tab, ref);
    },
    [tab, setFormRef],
  );

  return (
    <Form<WritableAdminSettingsType, FormStateMap>
      {...rest}
      formRef={formRef}
      liveValidate={false}
      state={state}
      tab={tab}
    />
  );
};
