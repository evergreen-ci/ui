import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import { fullWidthCss, objectGridCss } from "../../sharedStyles";
import {
  globalConfig,
  okta,
  naive,
  github,
  multi,
  kanopy,
  oauth,
} from "./schemaFields";

export const getFormSchema = (): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    type: "object" as const,
    properties: {
      authentication: {
        type: "object" as const,
        title: "",
        properties: {
          globalConfig: {
            type: "object" as const,
            title: "Global Config",
            properties: globalConfig.schema,
          },
          okta: {
            type: "object" as const,
            title: "Okta",
            properties: okta.schema,
          },
          naive: {
            type: "object" as const,
            title: "Naive Authentication",
            properties: naive.schema,
          },
          kanopy: {
            type: "object" as const,
            title: "Kanopy Authentication",
            properties: kanopy.schema,
          },
          github: {
            type: "object" as const,
            title: "GitHub Authentication",
            properties: github.schema,
          },
          oauth: {
            type: "object" as const,
            title: "OAuth Authentication",
            properties: oauth.schema,
          },
          multi: {
            type: "object" as const,
            title: "Multi Authentication",
            properties: multi.schema,
          },
        },
      },
    },
  },
  uiSchema: {
    authentication: {
      globalConfig: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        "ui:data-cy": "globalConfig",
        "ui:objectFieldCss": objectGridCss,
        ...globalConfig.uiSchema,
      },
      okta: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        "ui:data-cy": "okta",
        "ui:objectFieldCss": objectGridCss,
        ...okta.uiSchema,
      },
      naive: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        "ui:data-cy": "naive",
        "ui:objectFieldCss": fullWidthCss,
        ...naive.uiSchema,
      },
      kanopy: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        "ui:data-cy": "kanopy",
        "ui:objectFieldCss": objectGridCss,
        ...kanopy.uiSchema,
      },
      github: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        "ui:data-cy": "github",
        "ui:objectFieldCss": objectGridCss,
        ...github.uiSchema,
      },
      oauth: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        "ui:data-cy": "oauth",
        "ui:objectFieldCss": objectGridCss,
        ...oauth.uiSchema,
      },
      multi: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        "ui:data-cy": "multi",
        "ui:objectFieldCss": objectGridCss,
        ...multi.uiSchema,
      },
    },
  },
});
