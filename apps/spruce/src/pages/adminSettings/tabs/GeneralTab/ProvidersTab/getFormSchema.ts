import { GetFormSchema } from "components/SpruceForm";
import { containerPools, aws, docker } from "./schemaFields";

export const formSchema: ReturnType<GetFormSchema> = {
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
            // @ts-expect-error: Dependencies throws error but works as expected.
            properties: aws.schema,
          },
          docker: {
            type: "object" as const,
            title: "Docker",
            properties: docker.schema,
          },
        },
      },
    },
  },
  uiSchema: {
    providers: {
      containerPools: containerPools.uiSchema,
      aws: aws.uiSchema,
      docker: docker.uiSchema,
    },
  },
};
