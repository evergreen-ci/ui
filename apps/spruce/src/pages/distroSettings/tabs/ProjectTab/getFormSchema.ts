import { GetFormSchema } from "components/SpruceForm";
import {
  CardFieldTemplate,
  FieldRow,
} from "components/SpruceForm/FieldTemplates";

export const getFormSchema = (): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    type: "object" as const,
    properties: {
      expansions: {
        type: "array" as const,
        title: "Expansions",
        items: {
          type: "object" as const,
          properties: {
            key: {
              type: "string" as const,
              title: "Key",
              default: "",
              minLength: 1,
            },
            value: {
              type: "string" as const,
              title: "Value",
              default: "",
              minLength: 1,
            },
          },
        },
      },
      validProjects: {
        type: "array" as const,
        title: "Valid Projects",
        items: {
          type: "string" as const,
          title: "Project ID",
          default: "",
          minLength: 1,
        },
      },
    },
  },
  uiSchema: {
    "ui:ObjectFieldTemplate": CardFieldTemplate,
    expansions: {
      "ui:addButtonText": "Add expansion",
      "ui:orderable": false,
      items: {
        "ui:ObjectFieldTemplate": FieldRow,
        "ui:label": false,
      },
    },
    validProjects: {
      "ui:addButtonText": "Add project",
      "ui:orderable": false,
      items: {
        "ui:label": false,
      },
    },
  },
});
