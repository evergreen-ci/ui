export const modalFormDefinition = {
  initialFormData: {
    newDistroId: "",
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
    },
  },
  uiSchema: {
    newDistroId: {
      "ui:data-cy": "distro-id-input",
    },
  },
};
