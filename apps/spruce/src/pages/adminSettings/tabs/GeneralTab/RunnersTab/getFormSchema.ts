import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import { objectGridCss } from "../../sharedStyles";
import {
  notify,
  taskLimits,
  hostInit,
  podLifecycle,
  scheduler,
  repotracker,
} from "./schemaFields";

export const formSchema: ReturnType<GetFormSchema> = {
  fields: {},
  schema: {
    type: "object" as const,
    properties: {
      runners: {
        type: "object" as const,
        title: "",
        properties: {
          notify: {
            type: "object" as const,
            title: "Notify",
            properties: {
              ...notify.schema,
            },
          },
          taskLimits: {
            type: "object" as const,
            title: "Task Limits",
            properties: {
              ...taskLimits.schema,
            },
          },
          hostInit: {
            type: "object" as const,
            title: "Host Init",
            properties: {
              ...hostInit.schema,
            },
          },
          podLifecycle: {
            type: "object" as const,
            title: "Pod Lifecycle",
            properties: {
              ...podLifecycle.schema,
            },
          },
          scheduler: {
            type: "object" as const,
            title: "Scheduler",
            properties: {
              ...scheduler.schema,
            },
          },
          repotracker: {
            type: "object" as const,
            title: "Repotracker",
            properties: {
              ...repotracker.schema,
            },
          },
        },
      },
    },
  },
  uiSchema: {
    runners: {
      notify: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        "ui:data-cy": "notify",
        ...notify.uiSchema,
      },
      taskLimits: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        "ui:objectFieldCss": objectGridCss,
        "ui:data-cy": "task-limits",
        ...taskLimits.uiSchema,
      },
      hostInit: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        "ui:objectFieldCss": objectGridCss,
        "ui:data-cy": "host-init",
        ...hostInit.uiSchema,
      },
      podLifecycle: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        "ui:objectFieldCss": objectGridCss,
        "ui:data-cy": "pod-lifecycle",
        ...podLifecycle.uiSchema,
      },
      scheduler: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        "ui:objectFieldCss": objectGridCss,
        "ui:data-cy": "scheduler",
        ...scheduler.uiSchema,
      },
      repotracker: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        "ui:objectFieldCss": objectGridCss,
        "ui:data-cy": "repotracker",
        ...repotracker.uiSchema,
      },
    },
  },
};
