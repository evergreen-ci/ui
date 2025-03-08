export const modalFormDefinition = {
  initialFormData: {
    newDistroId: "",
    singleTaskDistro: false,
  },
  schema: {
    type: "object" as const,
    properties: {
      newDistroId: {
        type: "string" as const,
        title: "Distro ID",
        format: "noSpaces",
        minLength: 1,
      },
      singleTaskDistro: {
        type: "boolean" as const,
        title: "Single Task Distro",
        default: false,
      },
    },
  },
  uiSchema: {
    newDistroId: {
      "ui:data-cy": "distro-id-input",
    },
    singleTaskDistro: {
      "ui:data-cy": "single-task-distro-checkbox",
      "ui:bold": true,
      "ui:description":
        "Each task will be run on a newly spun-up host. Hosts from this distro will only run one task or task group before terminating.",
    },
  },
};
