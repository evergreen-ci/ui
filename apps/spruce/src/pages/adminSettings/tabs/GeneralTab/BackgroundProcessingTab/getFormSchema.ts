import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import { objectGridCss } from "../../sharedStyles";
import {
  amboy,
  loggerConfig,
  notificationRateLimits,
  triggers,
} from "./schemaFields";

export const getFormSchema = ({
  distros,
}: {
  distros: string[];
}): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    type: "object" as const,
    properties: {
      backgroundProcessing: {
        type: "object" as const,
        title: "",
        properties: {
          amboy: {
            type: "object" as const,
            title: "Amboy",
            properties: {
              ...amboy.schema,
            },
          },
          loggerConfig: {
            type: "object" as const,
            title: "Logger",
            properties: {
              ...loggerConfig.schema,
            },
          },
          notificationRateLimits: {
            type: "object" as const,
            title: "Notification Rate Limits",
            properties: {
              ...notificationRateLimits.schema,
            },
          },
          triggers: {
            type: "object" as const,
            title: "Triggers",
            properties: {
              ...triggers(distros).schema,
            },
          },
        },
      },
    },
  },
  uiSchema: {
    backgroundProcessing: {
      amboy: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        "ui:data-cy": "amboy",
        "ui:objectFieldCss": objectGridCss,
        ...amboy.uiSchema,
      },
      loggerConfig: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        "ui:objectFieldCss": objectGridCss,
        "ui:data-cy": "logger",
        ...loggerConfig.uiSchema,
      },
      notificationRateLimits: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        "ui:objectFieldCss": objectGridCss,
        "ui:data-cy": "notification-rate-limits",
        ...notificationRateLimits.uiSchema,
      },
      triggers: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        "ui:objectFieldCss": objectGridCss,
        "ui:data-cy": "triggers",
        ...triggers(distros).uiSchema,
      },
    },
  },
});
