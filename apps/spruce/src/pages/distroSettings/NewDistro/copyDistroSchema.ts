export const modalFormDefinition = {
  initialFormData: {
    newDistroId: "",
  },
  schema: {
    properties: {
      newDistroId: {
        format: "noSpaces",
        minLength: 1,
        title: "Distro ID",
        type: "string" as const,
      },
    },
    type: "object" as const,
  },
  uiSchema: {
    newDistroId: {
      "ui:data-cy": "distro-id-input",
    },
  },
};
