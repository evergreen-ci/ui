import { SpruceFormProps } from "components/SpruceForm/types";

export const getFormSchema = (
  name: string,
): {
  schema: SpruceFormProps["schema"];
  uiSchema: SpruceFormProps["uiSchema"];
} => ({
  schema: {
    properties: {
      newPatchName: {
        default: name,
        maxLength: 300,
        minLength: 1,
        title: "New Patch Name",
        type: "string" as const,
      },
    },
    type: "object" as const,
  },
  uiSchema: {
    newPatchName: {
      "ui:focusOnMount": true,
      "ui:widget": "textarea",
    },
  },
});
