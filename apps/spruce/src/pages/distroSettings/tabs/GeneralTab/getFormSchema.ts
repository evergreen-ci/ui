import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";

export const getFormSchema = (
  isContainerDistro: boolean,
  minimumHosts: number,
): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    type: "object" as const,
    properties: {
      distroName: {
        type: "object" as const,
        title: "",
        properties: {
          name: {
            type: "string" as const,
            title: "Identifier",
            readOnly: true,
          },
        },
      },
      distroImage: {
        type: "object" as const,
        title: "",
        properties: {
          image: {
            type: "string" as const,
            title: "Image",
            default: "",
          },
        },
      },
      distroAliases: {
        type: "object" as const,
        title: "Aliases",
        properties: {
          aliases: {
            type: "array" as const,
            items: {
              type: "string" as const,
              title: "Alias",
              default: "",
              minLength: 1,
            },
          },
        },
      },
      distroOptions: {
        type: "object" as const,
        title: "Distro Options",
        properties: {
          adminOnly: {
            type: "boolean" as const,
            title: "Admin only",
            default: false,
          },
          isCluster: {
            type: "boolean" as const,
            title: "Mark distro as cluster",
            default: false,
          },
          disableShallowClone: {
            type: "boolean" as const,
            title: "Disable shallow clone for this distro",
            default: false,
          },
          disabled: {
            type: "boolean" as const,
            title: "Disable queueing for this distro",
            default: false,
          },
          note: {
            type: "string" as const,
            title: "Notes",
            default: "",
          },
          warningNote: {
            type: "string" as const,
            title: "Warnings",
            default: "",
          },
        },
      },
    },
  },
  uiSchema: {
    distroName: {
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      name: {
        ...(isContainerDistro && {
          "ui:warnings": [
            "Distro is a container pool, so it cannot be spawned for tasks.",
          ],
        }),
      },
    },
    distroImage: {
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      image: {
        "ui:description": "The image from which this distro inherits.",
      },
    },
    distroAliases: {
      "ui:rootFieldId": "aliases",
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      aliases: {
        "ui:addButtonText": "Add alias",
        "ui:orderable": false,
        "ui:showLabel": false,
        items: {
          "ui:label": false,
        },
      },
    },
    distroOptions: {
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      adminOnly: {
        "ui:description":
          "Admin-only distros are not selectable by general users (e.g. when spawning a host). They do not have their access controlled beyond being hidden.",
      },
      isCluster: {
        "ui:description":
          "Jobs will not be run on this host. Used for special purposes.",
      },
      disabled: {
        "ui:description": "Tasks already in the task queue will be removed.",
        ...(minimumHosts > 0 && {
          "ui:tooltipDescription": `This will still allow the minimum number of hosts (${minimumHosts}) to start`,
        }),
      },
      note: {
        "ui:rows": 7,
        "ui:widget": "textarea",
      },
      warningNote: {
        "ui:rows": 2,
        "ui:widget": "textarea",
        "ui:description":
          "This will be displayed to users when selecting this distro as part of evergreen yml validation.",
      },
    },
  },
});
