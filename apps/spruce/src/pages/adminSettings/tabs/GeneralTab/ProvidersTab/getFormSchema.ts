import { GetFormSchema } from "components/SpruceForm";
import { containerPools, aws, docker } from "./schemaFields";

export const formSchema: ReturnType<GetFormSchema> = {
  fields: {},
  schema: {
    properties: {
      providers: {
        properties: {
          aws: {
            properties: aws.schema,
            title: "AWS Configuration",
            type: "object" as const,
          },
          containerPools: {
            properties: containerPools.schema,
            title: "Container Pools",
            type: "object" as const,
          },
          docker: {
            properties: docker.schema,
            title: "Docker",
            type: "object" as const,
          },
        },
        title: "",
        type: "object" as const,
      },
    },
    type: "object" as const,
  },
  uiSchema: {
    providers: {
      aws: aws.uiSchema,
      containerPools: containerPools.uiSchema,
      docker: docker.uiSchema,
    },
  },
};
