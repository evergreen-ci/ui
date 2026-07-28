import { FormProps } from "@rjsf/core";
import {
  Field,
  FormContextType,
  FormValidation,
  ObjectFieldTemplateProps,
  RJSFSchema,
  StrictRJSFSchema,
} from "@rjsf/utils";

// typescript utility to recursively iterate through an object and add a method called addError to each property
export type ValidateProps<T> = (
  formData: T | undefined,
  errors: FormValidation<T>,
) => FormValidation<T>;

export type RecursivelyAddError<T> = FormValidation<T>;

type CustomFormatFields = {
  jiraHost?: string;
};

export type SpruceFormProps<
  // RJSF's form-data type is inferred at concrete consumers.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  F extends FormContextType = any,
> = Pick<FormProps<T, S, F>, "schema" | "onChange" | "formData"> &
  Omit<Partial<FormProps<T, S, F>>, "customValidate"> & {
    customFormatFields?: CustomFormatFields;
    ObjectFieldTemplate?: React.ComponentType<ObjectFieldTemplateProps>;
    validate?: ValidateProps<T>;
  };

export type GetFormSchema<T = unknown, P extends unknown[] = never[]> = (
  ...params: P
) => {
  fields: Record<string, Field>;
  schema: SpruceFormProps<T>["schema"];
  uiSchema: SpruceFormProps<T>["uiSchema"];
};
