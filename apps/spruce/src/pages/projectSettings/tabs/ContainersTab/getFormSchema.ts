import { GetFormSchema } from "components/SpruceForm";
import {
  CardFieldTemplate,
  FieldRow,
} from "components/SpruceForm/FieldTemplates";
import { SpruceConfig } from "gql/generated/types";

export const getFormSchema = (
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  ecsConfig: SpruceConfig["providers"]["aws"]["pod"]["ecs"],
): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    type: "object" as const,
    properties: {
      containerSizeDefinitions: {
        title: "Container Configurations",
        type: "object" as const,
        properties: {
          variables: {
            type: "array" as const,
            title: "",
            items: {
              type: "object" as const,
              properties: {
                name: {
                  type: "string" as const,
                  title: "Name",
                  default: "",
                  minLength: 1,
                },
                memoryMb: {
                  type: "number" as const,
                  title: "Memory (MB)",
                  minimum: 1,
                  default: 100,
                  maximum: ecsConfig?.maxMemoryMb || 1024,
                },
                cpu: {
                  type: "number" as const,
                  title: "CPU",
                  minimum: 1,
                  default: 1,
                  maximum: ecsConfig?.maxCPU || 1024,
                },
              },
              required: ["memoryMb", "cpu"],
            },
          },
        },
      },
    },
  },
  uiSchema: {
    containerSizeDefinitions: {
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      variables: {
        "ui:description": `Specify custom computing resource configurations for running tasks in containers. The Memory field denotes the memory (in MB) that will be allocated, and the CPU field denotes the number of CPU units that will be allocated. 1024 CPU units is the equivalent of 1vCPU.`,
        "ui:fullWidth": true,
        "ui:orderable": false,
        "ui:addButtonText": "Add new configuration",
        items: {
          "ui:ObjectFieldTemplate": FieldRow,
          "ui:label": false,
          "ui:data-cy": "container-size-row",
          name: {
            "ui:data-cy": "var-name-input",
          },
          memoryMb: {
            "ui:data-cy": "var-memory-input",
          },
          cpu: {
            "ui:data-cy": "var-cpu-input",
          },
        },
      },
    },
  },
});
