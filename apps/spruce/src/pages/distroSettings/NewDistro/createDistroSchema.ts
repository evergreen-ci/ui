export const modalFormDefinition = {
  initialFormData: {
    newDistroId: "",
    singleTaskDistro: false,
  },
  schema: {
    properties: {
      newDistroId: {
        format: "noSpaces",
        minLength: 1,
        title: "Distro ID",
        type: "string" as const,
      },
      singleTaskDistro: {
        default: false,
        title: "Single Task Distro",
        type: "boolean" as const,
      },
    },
    type: "object" as const,
  },
  uiSchema: {
    newDistroId: {
      "ui:data-cy": "distro-id-input",
    },
    singleTaskDistro: {
      "ui:bold": true,
      "ui:data-cy": "single-task-distro-checkbox",
      "ui:description":
        "Each task will be run on a newly spun-up host. Hosts from this distro will only run one task or task group before terminating.",
    },
  },
};
