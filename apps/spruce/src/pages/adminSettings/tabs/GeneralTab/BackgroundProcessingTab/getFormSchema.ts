import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import { objectGridCss } from "../../sharedStyles";
import {
  amboy,
  loggerConfig,
  notificationRateLimits,
  triggers,
} from "./schemaFields";

export const formSchema: ReturnType<GetFormSchema> = {
  fields: {},
  schema: {
    properties: {
      backgroundProcessing: {
        default: {},
        properties: {
          amboy: {
            default: {},
            properties: {
              ...amboy.schema,
            },
            title: "Amboy",
            type: "object" as const,
          },
          loggerConfig: {
            default: {},
            properties: {
              ...loggerConfig.schema,
            },
            title: "Logger",
            type: "object" as const,
          },
          notificationRateLimits: {
            default: {},
            properties: {
              ...notificationRateLimits.schema,
            },
            title: "Notification Rate Limits",
            type: "object" as const,
          },
          triggers: {
            default: {},
            properties: {
              ...triggers.schema,
            },
            title: "Triggers",
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
    backgroundProcessing: {
      amboy: {
        "ui:data-cy": "amboy",
        "ui:objectFieldCss": objectGridCss,
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        ...amboy.uiSchema,
      },
      loggerConfig: {
        "ui:data-cy": "logger",
        "ui:objectFieldCss": objectGridCss,
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        ...loggerConfig.uiSchema,
      },
      notificationRateLimits: {
        "ui:data-cy": "notification-rate-limits",
        "ui:objectFieldCss": objectGridCss,
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        ...notificationRateLimits.uiSchema,
      },
      triggers: {
        "ui:data-cy": "triggers",
        "ui:objectFieldCss": objectGridCss,
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        ...triggers.uiSchema,
      },
    },
  },
};
