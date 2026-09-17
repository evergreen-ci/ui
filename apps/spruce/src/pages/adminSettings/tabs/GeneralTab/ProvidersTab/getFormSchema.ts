import { GetFormSchema } from "components/SpruceForm";
import { aws, containerPools, docker } from "./schemaFields";

type ResourceTags = {
  mongodbEnv: string;
  mongodbOwner: string;
};

export const getFormSchema = ({
  mongodbEnv,
  mongodbOwner,
}: ResourceTags): ReturnType<GetFormSchema> => ({
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
                ...aws.schema.resourceTags,
                properties: {
                  ...aws.schema.resourceTags.properties,
                  mongodbEnv: {
                    ...aws.schema.resourceTags.properties.mongodbEnv,
                    enum: mongodbEnv
                      ? aws.schema.resourceTags.properties.mongodbEnv.enum.slice(1)
                      : aws.schema.resourceTags.properties.mongodbEnv.enum,
                    enumNames: mongodbEnv
                      ? aws.schema.resourceTags.properties.mongodbEnv.enumNames.slice(
                          1,
                        )
                      : aws.schema.resourceTags.properties.mongodbEnv.enumNames,
                  },
                  mongodbOwner: {
                    ...aws.schema.resourceTags.properties.mongodbOwner,
                    ...(mongodbOwner ? { minLength: 1 } : {}),
                  },
                },
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
      aws: aws.uiSchema,
      docker: docker.uiSchema,
    },
  },
});

export const formSchema = getFormSchema({ mongodbEnv: "", mongodbOwner: "" });
