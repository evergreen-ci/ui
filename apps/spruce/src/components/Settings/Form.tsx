import {
  SpruceForm,
  SpruceFormProps,
  SpruceFormRef,
  ValidateProps,
  GetFormSchema,
} from "components/SpruceForm";
import { SettingsState } from "./Context";
import { SettingsRoutes } from "./types";

export type FormProps<
  T extends SettingsRoutes,
  FormStateMap extends Record<T, any>,
> = {
  formRef?: React.Ref<SpruceFormRef>;
  formSchema: ReturnType<GetFormSchema>;
  state: SettingsState<T, FormStateMap>;
  tab: T;
  validate?: ValidateProps<FormStateMap[T]>;
} & Omit<
  SpruceFormProps,
  "fields" | "formData" | "onChange" | "schema" | "uiSchema" | "validate"
>;

export const Form = <
  T extends SettingsRoutes,
  FormStateMap extends Record<T, any>,
>({
  formRef,
  formSchema,
  state,
  tab,
  validate,
  ...rest
}: FormProps<T, FormStateMap>) => {
  const { getTab, updateForm } = state;
  const { formData } = getTab(tab);
  const { fields, schema, uiSchema } = formSchema;

  if (!formData) return null;

  return (
    <SpruceForm
      ref={formRef}
      {...rest}
      fields={fields}
      formData={formData}
      onChange={updateForm(tab)}
      schema={schema}
      uiSchema={uiSchema}
      validate={validate as any}
    />
  );
};
