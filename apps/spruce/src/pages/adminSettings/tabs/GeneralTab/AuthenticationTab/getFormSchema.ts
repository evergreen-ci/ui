import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import { fullWidthCss, objectGridCss } from "../../sharedStyles";
import {
  github,
  globalConfig,
  kanopy,
  multi,
  naive,
  oauth,
  okta,
} from "./schemaFields";

export const formSchema: ReturnType<GetFormSchema> = {
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
        "ui:data-testid": "globalConfig",
        "ui:objectFieldCss": objectGridCss,
        ...globalConfig.uiSchema,
      },
      okta: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        "ui:data-testid": "okta",
        "ui:objectFieldCss": objectGridCss,
        ...okta.uiSchema,
      },
      naive: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        "ui:data-testid": "naive",
        "ui:objectFieldCss": fullWidthCss,
        ...naive.uiSchema,
      },
      kanopy: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        "ui:data-testid": "kanopy",
        "ui:objectFieldCss": objectGridCss,
        ...kanopy.uiSchema,
      },
      github: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        "ui:data-testid": "github",
        "ui:objectFieldCss": objectGridCss,
        ...github.uiSchema,
      },
      oauth: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        "ui:data-testid": "oauth",
        "ui:objectFieldCss": objectGridCss,
        ...oauth.uiSchema,
      },
      multi: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        "ui:data-testid": "multi",
        "ui:objectFieldCss": objectGridCss,
        ...multi.uiSchema,
      },
    },
  },
};
