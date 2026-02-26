import { css } from "@emotion/react";
import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import { objectGridCss } from "../../sharedStyles";
import { api, ui, disabledGQLQueries, betaFeatures } from "./schemaFields";

export const formSchema: ReturnType<GetFormSchema> = {
  fields: {},
  schema: {
    type: "object" as const,
    properties: {
      web: {
        type: "object" as const,
        title: "",
        properties: {
          api: {
            type: "object" as const,
            title: "API Settings",
            properties: {
              ...api.schema,
            },
          },
          ui: {
            type: "object" as const,
            title: "UI Settings",
            properties: {
              ...ui.schema,
            },
          },
          betaFeatures: {
            type: "object" as const,
            title: "Beta Features",
            properties: {
              ...betaFeatures.schema,
            },
          },
          disabledGQLQueries: {
            type: "object" as const,
            title: "Disabled GraphQL Queries",
            properties: {
              ...disabledGQLQueries.schema,
            },
          },
        },
      },
    },
  },
  uiSchema: {
    web: {
      api: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        "ui:objectFieldCss": objectGridCss,
        "ui:data-cy": "api-settings",
        ...api.uiSchema,
      },
      ui: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        "ui:objectFieldCss": objectGridCss,
        "ui:data-cy": "ui-settings",
        ...ui.uiSchema,
      },
      betaFeatures: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        "ui:data-cy": "beta-features",
        "ui:objectFieldCss": css`
          /* Hide the nested SettingsCard when it's empty (all fields hidden) */
          [data-cy="beta-features"]:empty {
            display: none;
          }
        `,
        ...betaFeatures.uiSchema,
      },
      disabledGQLQueries: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        "ui:data-cy": "disabled-gql-queries",
        ...disabledGQLQueries.uiSchema,
      },
    },
  },
};
