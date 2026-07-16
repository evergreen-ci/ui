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

export const formSchema: ReturnType<GetFormSchema> = {
  fields: {},
  schema: {
    properties: {
      authentication: {
        properties: {
          github: {
            properties: github.schema,
            title: "GitHub Authentication",
            type: "object" as const,
          },
          globalConfig: {
            properties: globalConfig.schema,
            title: "Global Config",
            type: "object" as const,
          },
          kanopy: {
            properties: kanopy.schema,
            title: "Kanopy Authentication",
            type: "object" as const,
          },
          multi: {
            properties: multi.schema,
            title: "Multi Authentication",
            type: "object" as const,
          },
          naive: {
            properties: naive.schema,
            title: "Naive Authentication",
            type: "object" as const,
          },
          oauth: {
            properties: oauth.schema,
            title: "OAuth Authentication",
            type: "object" as const,
          },
          okta: {
            properties: okta.schema,
            title: "Okta",
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
    authentication: {
      github: {
        "ui:data-cy": "github",
        "ui:objectFieldCss": objectGridCss,
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        ...github.uiSchema,
      },
      globalConfig: {
        "ui:data-cy": "globalConfig",
        "ui:objectFieldCss": objectGridCss,
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        ...globalConfig.uiSchema,
      },
      kanopy: {
        "ui:data-cy": "kanopy",
        "ui:objectFieldCss": objectGridCss,
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        ...kanopy.uiSchema,
      },
      multi: {
        "ui:data-cy": "multi",
        "ui:objectFieldCss": objectGridCss,
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        ...multi.uiSchema,
      },
      naive: {
        "ui:data-cy": "naive",
        "ui:objectFieldCss": fullWidthCss,
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        ...naive.uiSchema,
      },
      oauth: {
        "ui:data-cy": "oauth",
        "ui:objectFieldCss": objectGridCss,
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        ...oauth.uiSchema,
      },
      okta: {
        "ui:data-cy": "okta",
        "ui:objectFieldCss": objectGridCss,
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        ...okta.uiSchema,
      },
    },
  },
};
