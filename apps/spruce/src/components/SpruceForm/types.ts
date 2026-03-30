import { FieldValidation, FormProps, Field } from "@rjsf/core";

// typescript utility to recursively iterate through an object and add a method called addError to each property
type RecursivelyAddError<T> = T extends object
  ? {
      [K in keyof T]: RecursivelyAddError<T[K]>;
    } & FieldValidation
  : FieldValidation;

/** typescript utility to coerce `@rjsf/core` validate prop signature to more accurately represent the shape of the actual validate function signature  */
export type ValidateProps<T> = (
  FormState: T,
  errors: RecursivelyAddError<T>,
) => RecursivelyAddError<T>;

type CustomFormatFields = {
  jiraHost?: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- any is required as a generic default for RJSF compatibility
export type SpruceFormProps<A = any> = Pick<
  FormProps<A>,
  "schema" | "onChange" | "formData"
> &
  Partial<FormProps<A>> & { customFormatFields?: CustomFormatFields };

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- any is required as generic defaults for flexible schema function signatures
export type GetFormSchema<T = any, P extends any[] = any[]> = (
  ...params: P
) => {
  fields: Record<string, Field>;
  schema: SpruceFormProps<T>["schema"];
  uiSchema: SpruceFormProps<T>["uiSchema"];
};
