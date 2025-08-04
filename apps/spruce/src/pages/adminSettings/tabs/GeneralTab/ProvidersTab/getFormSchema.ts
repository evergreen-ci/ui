import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import { fullWidthCss, objectGridCss } from "../../sharedStyles";
import { containerPools, aws, repoExceptions } from "./schemaFields";

export const getFormSchema = (): ReturnType<GetFormSchema> => ({
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
            properties: {
              ...containerPools.schema,
            },
          },
          aws: {
            type: "object" as const,
            title: "AWS Configuration",
            properties: {
              ...aws.schema,
            },
          },
          repoExceptions: {
            type: "object" as const,
            title: "Repo Exceptions",
            properties: {
              ...repoExceptions.schema,
            },
          },
        },
      },
    },
  },
  uiSchema: {
    providers: {
      containerPools: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        "ui:data-cy": "container-pools",
        "ui:objectFieldCss": objectGridCss,
        ...containerPools.uiSchema,
      },
      aws: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        "ui:objectFieldCss": objectGridCss,
        "ui:data-cy": "aws-configuration",
        ...aws.uiSchema,
      },
      repoExceptions: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        "ui:objectFieldCss": fullWidthCss,
        "ui:data-cy": "repo-exceptions",
        ...repoExceptions.uiSchema,
      },
    },
  },
});
