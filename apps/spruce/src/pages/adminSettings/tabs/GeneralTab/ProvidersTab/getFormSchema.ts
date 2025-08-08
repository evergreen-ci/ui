import { GetFormSchema } from "components/SpruceForm";
import { containerPools, aws, repoExceptions } from "./schemaFields";

export const getFormSchema: ReturnType<GetFormSchema> = {
  fields: {},
  schema: {
    type: "object" as const,
    properties: {
      providers: {
        type: "object" as const,
        title: "",
        properties: {
          containerPools: {
            type: "object" as const,
            title: "Container Pools",
            properties: containerPools.schema,
          },
          aws: {
            type: "object" as const,
            title: "AWS Configuration",
            properties: aws.schema,
          },
          repoExceptions: {
            type: "object" as const,
            title: "Repo Exceptions",
            properties: repoExceptions.schema,
          },
        },
      },
    },
  },
  uiSchema: {
    providers: {
      containerPools: containerPools.uiSchema,
      aws: aws.uiSchema,
      repoExceptions: repoExceptions.uiSchema,
    },
  },
};
