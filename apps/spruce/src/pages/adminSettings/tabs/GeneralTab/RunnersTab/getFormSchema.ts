import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import { objectGridCss } from "../../sharedStyles";
import {
  notify,
  taskLimits,
  hostInit,
  scheduler,
  repotracker,
} from "./schemaFields";

export const formSchema: ReturnType<GetFormSchema> = {
  fields: {},
  schema: {
    properties: {
      runners: {
        properties: {
          hostInit: {
            properties: {
              ...hostInit.schema,
            },
            title: "Host Init",
            type: "object" as const,
          },
          notify: {
            properties: {
              ...notify.schema,
            },
            title: "Notify",
            type: "object" as const,
          },
          repotracker: {
            properties: {
              ...repotracker.schema,
            },
            title: "Repotracker",
            type: "object" as const,
          },
          scheduler: {
            properties: {
              ...scheduler.schema,
            },
            title: "Scheduler",
            type: "object" as const,
          },
          taskLimits: {
            properties: {
              ...taskLimits.schema,
            },
            title: "Task Limits",
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
    runners: {
      hostInit: {
        "ui:data-cy": "host-init",
        "ui:objectFieldCss": objectGridCss,
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        ...hostInit.uiSchema,
      },
      notify: {
        "ui:data-cy": "notify",
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        ...notify.uiSchema,
      },
      repotracker: {
        "ui:data-cy": "repotracker",
        "ui:objectFieldCss": objectGridCss,
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        ...repotracker.uiSchema,
      },
      scheduler: {
        "ui:data-cy": "scheduler",
        "ui:objectFieldCss": objectGridCss,
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        ...scheduler.uiSchema,
      },
      taskLimits: {
        "ui:data-cy": "task-limits",
        "ui:objectFieldCss": objectGridCss,
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        ...taskLimits.uiSchema,
      },
    },
  },
};
