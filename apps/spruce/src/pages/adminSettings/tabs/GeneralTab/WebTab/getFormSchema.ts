import { css } from "@emotion/react";
import { size } from "@evg-ui/lib/constants/tokens";
import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import { api, ui, disabledGQLQueries, betaFeatures } from "./schemaFields";

const gridWrapCss = css`
  > div {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: ${size.m};
  }
`;
export const getFormSchema = (): ReturnType<GetFormSchema> => ({
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
        "ui:objectFieldCss": gridWrapCss,
        "ui:data-cy": "api-settings",
        ...api.uiSchema,
      },
      ui: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        "ui:objectFieldCss": gridWrapCss,
        "ui:data-cy": "ui-settings",
        ...ui.uiSchema,
      },
      betaFeatures: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        "ui:data-cy": "beta-features",
        ...betaFeatures.uiSchema,
      },
      disabledGQLQueries: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        "ui:data-cy": "disabled-gql-queries",
        ...disabledGQLQueries.uiSchema,
      },
    },
  },
});
