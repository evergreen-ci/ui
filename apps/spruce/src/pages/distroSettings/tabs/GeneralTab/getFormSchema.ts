import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";

export const getFormSchema = (
  isContainerDistro: boolean,
  minimumHosts: number,
  singleTaskDistroWarnings: string[],
): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    properties: {
      costData: {
        properties: {
          onDemandRate: {
            readOnly: true,
            title: "On Demand Rate",
            type: "number" as const,
          },
          savingsPlanRate: {
            readOnly: true,
            title: "Savings Plan Rate",
            type: "number" as const,
          },
        },
        title: "Cost Data",
        type: "object" as const,
      },
      distroAliases: {
        properties: {
          aliases: {
            items: {
              default: "",
              minLength: 1,
              title: "Alias",
              type: "string" as const,
            },
            type: "array" as const,
          },
        },
        title: "Aliases",
        type: "object" as const,
      },
      distroImage: {
        properties: {
          image: {
            default: "",
            title: "Image",
            type: "string" as const,
          },
        },
        title: "",
        type: "object" as const,
      },
      distroName: {
        properties: {
          name: {
            readOnly: true,
            title: "Identifier",
            type: "string" as const,
          },
        },
        title: "",
        type: "object" as const,
      },
      distroOptions: {
        properties: {
          adminOnly: {
            default: false,
            title: "Admin only",
            type: "boolean" as const,
          },
          disabled: {
            default: false,
            title: "Disable queueing for this distro",
            type: "boolean" as const,
          },
          disableShallowClone: {
            default: false,
            title: "Disable shallow clone for this distro",
            type: "boolean" as const,
          },
          isCluster: {
            default: false,
            title: "Mark distro as cluster",
            type: "boolean" as const,
          },
          note: {
            default: "",
            title: "Notes",
            type: "string" as const,
          },
          singleTaskDistro: {
            default: false,
            title: "Set distro as Single Task Distro",
            type: "boolean" as const,
          },
          warningNote: {
            default: "",
            title: "Warnings",
            type: "string" as const,
          },
        },
        title: "Distro Options",
        type: "object" as const,
      },
    },
    type: "object" as const,
  },
  uiSchema: {
    costData: {
      onDemandRate: {
        "ui:description": "The on-demand rate for this distro.",
      },
      savingsPlanRate: {
        "ui:description": "The savings plan rate for this distro.",
      },
      "ui:ObjectFieldTemplate": CardFieldTemplate,
    },
    distroAliases: {
      aliases: {
        items: {
          "ui:label": false,
        },
        "ui:addButtonText": "Add alias",
        "ui:orderable": false,
        "ui:showLabel": false,
      },
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      "ui:rootFieldId": "aliases",
    },
    distroImage: {
      image: {
        "ui:description": "The image from which this distro inherits.",
      },
      "ui:ObjectFieldTemplate": CardFieldTemplate,
    },
    distroName: {
      name: {
        ...(isContainerDistro && {
          "ui:warnings": [
            "Distro is a container pool, so it cannot be spawned for tasks.",
          ],
        }),
      },
      "ui:ObjectFieldTemplate": CardFieldTemplate,
    },
    distroOptions: {
      adminOnly: {
        "ui:description":
          "Admin-only distros are not selectable by general users (e.g. when spawning a host). They do not have their access controlled beyond being hidden.",
      },
      disabled: {
        "ui:description": "Tasks already in the task queue will be removed.",
        ...(minimumHosts > 0 && {
          "ui:tooltipDescription": `This will still allow the minimum number of hosts (${minimumHosts}) to start`,
        }),
      },
      isCluster: {
        "ui:description":
          "Jobs will not be run on this host. Used for special purposes.",
      },
      note: {
        "ui:rows": 7,
        "ui:widget": "textarea",
      },
      singleTaskDistro: {
        "ui:data-cy-banner": "single-task-banner",
        "ui:description":
          "Hosts will run only one task or task group before terminating.",
        "ui:warnings": singleTaskDistroWarnings,
      },
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      warningNote: {
        "ui:description":
          "This will be displayed to users when selecting this distro as part of evergreen yml validation.",
        "ui:rows": 2,
        "ui:widget": "textarea",
      },
    },
  },
});
