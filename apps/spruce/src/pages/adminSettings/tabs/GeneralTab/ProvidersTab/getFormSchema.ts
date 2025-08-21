import { GetFormSchema } from "components/SpruceForm";
import { containerPools, aws } from "./schemaFields";

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
            // @ts-expect-error: Dependencies throws error but works as expected.
            properties: aws.schema,
          },
        },
      },
    },
  },
  uiSchema: {
    providers: {
      containerPools: containerPools.uiSchema,
      aws: aws.uiSchema,
    },
  },
};
