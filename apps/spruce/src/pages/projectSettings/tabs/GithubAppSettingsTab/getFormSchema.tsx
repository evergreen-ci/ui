import { GetFormSchema } from "components/SpruceForm";

export const getFormSchema = (): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    type: "object" as "object",
    properties: {
      appCredentials: {
        type: "object" as "object",
        title: "App Credentials",
      },
      tokenPermissionRestrictions: {
        type: "object" as "object",
        title: "Token Permission Restrictions",
      },
    },
  },
  uiSchema: {},
});
