import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";

export const getFormSchema = (): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    type: "object" as const,
    properties: {
      taskOwnership: {
        type: "object" as const,
        title: "Task Ownership",
        properties: {
          dummyPlaceholder: {
            type: "string" as const,
            title: "Dummy Placeholder",
            default: "",
          },
        },
      },
    },
  },
  uiSchema: {
    taskOwnership: {
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      dummyPlaceholder: {
        "ui:description":
          "This is a placeholder input to show that the tab works.",
      },
    },
  },
});
