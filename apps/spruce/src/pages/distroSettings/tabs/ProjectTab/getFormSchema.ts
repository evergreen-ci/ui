import { GetFormSchema } from "components/SpruceForm";
import {
  CardFieldTemplate,
  FieldRow,
} from "components/SpruceForm/FieldTemplates";

export const getFormSchema = (): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    properties: {
      expansions: {
        items: {
          properties: {
            key: {
              default: "",
              minLength: 1,
              title: "Key",
              type: "string" as const,
            },
            value: {
              default: "",
              minLength: 1,
              title: "Value",
              type: "string" as const,
            },
          },
          type: "object" as const,
        },
        title: "Expansions",
        type: "array" as const,
      },
      validProjects: {
        items: {
          default: "",
          minLength: 1,
          title: "Project ID",
          type: "string" as const,
        },
        title: "Valid Projects",
        type: "array" as const,
      },
    },
    type: "object" as const,
  },
  uiSchema: {
    expansions: {
      items: {
        "ui:data-cy": "expansion-item",
        "ui:label": false,
        "ui:ObjectFieldTemplate": FieldRow,
      },
      "ui:addButtonText": "Add expansion",
      "ui:orderable": false,
    },
    "ui:ObjectFieldTemplate": CardFieldTemplate,
    validProjects: {
      items: {
        "ui:label": false,
      },
      "ui:addButtonText": "Add project",
      "ui:orderable": false,
    },
  },
});
