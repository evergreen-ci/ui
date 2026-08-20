import { FormProps, IChangeEvent } from "@rjsf/core";
import {
  Field,
  FieldValidation,
  FormContextType,
  ObjectFieldTemplateProps,
  RJSFSchema,
  StrictRJSFSchema,
} from "@rjsf/utils";

// typescript utility to recursively iterate through an object and add a method called addError to each property
export type RecursivelyAddError<T> = T extends object
  ? {
      [K in keyof T]: RecursivelyAddError<T[K]>;
    } & FieldValidation
  : FieldValidation;

export type ValidateProps<T> = {
  bivarianceHack(
    formData: T,
    errors: RecursivelyAddError<T>,
  ): RecursivelyAddError<T>;
}["bivarianceHack"];

export type SpruceChangeEvent<T> = Omit<IChangeEvent<T>, "formData"> & {
  formData: T;
};

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
> = Pick<FormProps<T, S, F>, "schema"> &
  Omit<
    Partial<FormProps<T, S, F>>,
    "customValidate" | "formData" | "onChange"
  > & {
    customValidate?: ValidateProps<T>;
    customFormatFields?: CustomFormatFields;
    formData?: T;
    ObjectFieldTemplate?: React.ComponentType<ObjectFieldTemplateProps>;
    onChange?: (data: SpruceChangeEvent<T>, id?: string) => void;
  };

export type GetFormSchema<T = unknown, P extends unknown[] = never[]> = (
  ...params: P
) => {
  fields: Record<string, Field>;
  schema: SpruceFormProps<T>["schema"];
  uiSchema: SpruceFormProps<T>["uiSchema"];
};
