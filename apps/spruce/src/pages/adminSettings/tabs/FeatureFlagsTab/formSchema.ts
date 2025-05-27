import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";

export const getFormSchema = (): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    type: "object" as const,
    properties: {
      featureFlags: {
        type: "object" as const,
        title: "Feature Flags",
        properties: {
          services: {
            type: "boolean" as const,
            title: "Services",
            oneOf: [
              { const: true, title: "Enabled" },
              { const: false, title: "Disabled" },
            ],
          },
          notifications: {
            type: "boolean" as const,
            title: "Notifications",
            oneOf: [
              { const: true, title: "Enabled" },
              { const: false, title: "Disabled" },
            ],
          },
          features: {
            type: "boolean" as const,
            title: "Features",
            oneOf: [
              { const: true, title: "Enabled" },
              { const: false, title: "Disabled" },
            ],
          },
          batchJobs: {
            type: "boolean" as const,
            title: "Batch Jobs",
            oneOf: [
              { const: true, title: "Enabled" },
              { const: false, title: "Disabled" },
            ],
          },
          disabledGqlQueries: {
            type: "boolean" as const,
            title: "Disabled GQL Queries",
            oneOf: [
              { const: true, title: "Enabled" },
              { const: false, title: "Disabled" },
            ],
          },
        },
      },
    },
  },
  uiSchema: {
    featureFlags: {
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      services: { "ui:widget": "RadioWidget" },
      notifications: { "ui:widget": "RadioWidget" },
      features: { "ui:widget": "RadioWidget" },
      batchJobs: { "ui:widget": "RadioWidget" },
      disabledGqlQueries: { "ui:widget": "RadioWidget" },
    },
  },
});
