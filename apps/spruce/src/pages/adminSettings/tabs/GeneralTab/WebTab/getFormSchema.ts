import { css } from "@emotion/react";
import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import { objectGridCss } from "../../sharedStyles";
import {
  api,
  betaFeatures,
  disabledGQLQueries,
  rateLimitConfig,
  ui,
} from "./schemaFields";

export const formSchema: ReturnType<GetFormSchema> = {
  fields: {},
  schema: {
    properties: {
      web: {
        properties: {
          api: {
            properties: {
              ...api.schema,
            },
            title: "API Settings",
            type: "object" as const,
          },
          betaFeatures: {
            properties: {
              ...betaFeatures.schema,
            },
            title: "Beta Features",
            type: "object" as const,
          },
          disabledGQLQueries: {
            properties: {
              ...disabledGQLQueries.schema,
            },
            title: "Disabled GraphQL Queries",
            type: "object" as const,
          },
          rateLimitConfig: {
            properties: rateLimitConfig.schema,
            title: "API Rate Limit Config",
            type: "object" as const,
          },
          ui: {
            properties: {
              ...ui.schema,
            },
            title: "UI Settings",
            type: "object" as const,
          },
        },
        title: "",
        type: "object" as const,
      },
    },
    type: "object" as const,
  },
  uiSchema: {
    web: {
      api: {
        "ui:data-cy": "api-settings",
        "ui:objectFieldCss": objectGridCss,
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        ...api.uiSchema,
      },
      betaFeatures: {
        "ui:data-cy": "beta-features",
        "ui:objectFieldCss": css`
          [data-cy="beta-features"]:empty {
            display: none;
          }
        `,
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        ...betaFeatures.uiSchema,
      },
      disabledGQLQueries: {
        "ui:data-cy": "disabled-gql-queries",
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        ...disabledGQLQueries.uiSchema,
      },
      rateLimitConfig: rateLimitConfig.uiSchema,
      ui: {
        "ui:data-cy": "ui-settings",
        "ui:objectFieldCss": objectGridCss,
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        ...ui.uiSchema,
      },
    },
  },
};
