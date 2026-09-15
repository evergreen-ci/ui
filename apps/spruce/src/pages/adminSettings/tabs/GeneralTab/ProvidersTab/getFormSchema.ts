import { GetFormSchema } from "components/SpruceForm";
import { aws, containerPools, docker, resourceTags } from "./schemaFields";

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
            properties: {
              ...aws.schema,
              resourceTags: {
                type: "object" as const,
                title: "Resource Tags",
                description:
                  "Configure supported tags for AWS resources created by Evergreen.",
                properties: resourceTags.schema,
              },
            },
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
      aws: {
        ...aws.uiSchema,
        resourceTags: resourceTags.uiSchema,
      },
      docker: docker.uiSchema,
    },
  },
};
