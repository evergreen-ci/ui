import Form from "@rjsf/core";
import { SpruceFormContainer } from "./Container";
import { customFormats } from "./customFormats";
import { transformErrors } from "./errors";
import baseFields from "./Fields";
import {
  ArrayFieldTemplate,
  DefaultFieldTemplate,
  ObjectFieldTemplate,
} from "./FieldTemplates";
import { GetFormSchema, SpruceFormProps, ValidateProps } from "./types";
import widgets from "./Widgets";

export const SpruceForm: React.FC<SpruceFormProps> = ({
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
}) => (
  <Form
    ArrayFieldTemplate={ArrayFieldTemplate}
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    customFormats={customFormats(customFormatFields?.jiraHost)}
    disabled={disabled}
    fields={{ ...baseFields, ...fields }}
    FieldTemplate={DefaultFieldTemplate}
    formData={formData}
    liveValidate={liveValidate}
    noHtml5Validate
    ObjectFieldTemplate={ObjectFieldTemplate}
    onChange={onChange}
    schema={schema}
    showErrorList={false}
    tagName={tagName}
    transformErrors={transformErrors}
    uiSchema={uiSchema}
    validate={validate}
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    widgets={widgets}
    {...args}
  >
    {/*  Need to pass in an empty fragment child to remove default submit button */}
    {/* eslint-disable-next-line react/jsx-no-useless-fragment */}
    <></>
  </Form>
);

export { SpruceFormContainer };
export type { GetFormSchema, SpruceFormProps, ValidateProps };
