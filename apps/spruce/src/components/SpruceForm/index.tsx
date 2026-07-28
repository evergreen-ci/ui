import { forwardRef, useMemo } from "react";
import Form from "@rjsf/core";
import { customizeValidator } from "@rjsf/validator-ajv8";
import { SpruceFormContainer } from "./Container";
import { DescriptionField, TitleField } from "./CustomFields";
import { customFormats } from "./customFormats";
import { ErrorList } from "./ErrorList";
import { transformErrors } from "./errors";
import baseFields from "./Fields";
import {
  ArrayFieldItemTemplate,
  ArrayFieldTemplate,
  DefaultFieldTemplate,
  ObjectFieldTemplate,
} from "./FieldTemplates";
import { GetFormSchema, SpruceFormProps, ValidateProps } from "./types";
import widgets from "./Widgets";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SpruceFormRef = Form<any>;

export const SpruceForm = forwardRef<SpruceFormRef, SpruceFormProps>(
  (
    {
      customFormatFields,
      disabled,
      fields,
      formData,
      liveValidate = true,
      onChange,
      schema,
      tagName,
      uiSchema,
      validate,
      ...args
    },
    ref,
  ) => {
    const validator = useMemo(
      () =>
        customizeValidator({
          customFormats: customFormats(customFormatFields?.jiraHost),
        }),
      [customFormatFields?.jiraHost],
    );
    const templates = {
      ArrayFieldItemTemplate,
      ArrayFieldTemplate,
      DescriptionFieldTemplate: DescriptionField,
      ErrorListTemplate: ErrorList,
      FieldTemplate: DefaultFieldTemplate,
      ObjectFieldTemplate,
      TitleFieldTemplate: TitleField,
    };

    return (
      <Form
        ref={ref}
        customValidate={validate}
        disabled={disabled}
        fields={{ ...baseFields, ...fields }}
        formData={formData}
        liveValidate={liveValidate ? "onChange" : false}
        noHtml5Validate
        onChange={onChange}
        schema={schema}
        showErrorList={liveValidate ? false : "top"}
        tagName={tagName}
        templates={templates}
        transformErrors={transformErrors}
        uiSchema={{
          "ui:submitButtonOptions": { norender: true },
          ...uiSchema,
        }}
        validator={validator}
        widgets={widgets as never}
        {...args}
      />
    );
  },
);

SpruceForm.displayName = "SpruceForm";

export { SpruceFormContainer };
export type { GetFormSchema, SpruceFormProps, ValidateProps };
