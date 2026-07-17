import { SpruceFormProps } from "components/SpruceForm/types";

export const getFormSchema = (
  name: string,
): {
  schema: SpruceFormProps["schema"];
  uiSchema: SpruceFormProps["uiSchema"];
} => ({
  schema: {
    type: "object" as const,
    properties: {
      newPatchName: {
        title: "New Patch Name",
        type: "string" as const,
        default: name,
        maxLength: 300,
        minLength: 1,
      },
    },
  },
  uiSchema: {
    newPatchName: {
      "ui:widget": "textarea",
      "ui:focusOnMount": true,
    },
  },
});
