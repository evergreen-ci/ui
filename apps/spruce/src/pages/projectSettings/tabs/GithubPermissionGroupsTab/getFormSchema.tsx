import { GetFormSchema } from "components/SpruceForm";

export const getFormSchema = (): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    type: "object" as "object",
    properties: {
      permissionGroups: {
        type: "object" as "object",
        title: "Permission Groups",
      },
    },
  },
  uiSchema: {},
});
