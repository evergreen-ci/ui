import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import { ContainerPool, Provider } from "gql/generated/types";
import {
  dockerProviderSettings,
  ec2FleetProviderSettings,
  ec2ProviderAccountField,
  staticProviderSettings,
  taskHostOverridesFields,
} from "./schemaFields";
import { textAreaCSS } from "./styles";

export const getFormSchema = ({
  awsRegions,
  fleetRegionsInUse,
  isEC2Provider,
  poolMappingInfo,
  pools,
}: {
  awsRegions: string[];
  fleetRegionsInUse: string[];
  poolMappingInfo: string;
  pools: ContainerPool[];
  isEC2Provider: boolean;
}): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    dependencies: {
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      provider: {
        oneOf: [
          {
            properties: {
              provider: {
                properties: {
                  providerName: {
                    enum: [Provider.Static],
                  },
                },
              },
              staticProviderSettings: {
                properties: staticProviderSettings.schema,
                title: "",
                type: "object" as const,
              },
            },
          },
          {
            properties: {
              dockerProviderSettings: {
                properties: {
                  containerPoolId: {
                    default: "",
                    oneOf: pools.map((p) => ({
                      enum: [p.id],
                      title: p.id,
                      type: "string" as const,
                    })),
                    title: "Container Pool ID",
                    type: "string" as const,
                  },
                  poolMappingInfo: {
                    title: "Pool Mapping Information",
                    type: "string" as const,
                  },
                  ...dockerProviderSettings.schema,
                },
                title: "",
                type: "object" as const,
              },
              provider: {
                properties: {
                  providerName: {
                    enum: [Provider.Docker],
                  },
                },
              },
            },
          },
          {
            properties: {
              ec2FleetProviderSettings: {
                items: {
                  properties: {
                    region: {
                      default: "",
                      oneOf: awsRegions.map((r) => ({
                        enum: [r],
                        title: r,
                        type: "string" as const,
                      })),
                      title: "Region",
                      type: "string" as const,
                    },
                    ...ec2FleetProviderSettings.schema,
                  },
                  type: "object" as const,
                },
                minItems: 1,
                title: "",
                type: "array" as const,
              },
              provider: {
                properties: {
                  providerName: {
                    enum: [Provider.Ec2Fleet],
                  },
                },
              },
              taskHostOverrides: taskHostOverridesFields.schema,
            },
          },
        ],
      },
    },
    properties: {
      provider: {
        properties: {
          providerName: {
            oneOf: [
              {
                enum: [Provider.Static],
                title: "Static IP/VM",
                type: "string" as const,
              },
              {
                enum: [Provider.Docker],
                title: "Docker",
                type: "string" as const,
              },
              {
                enum: [Provider.Ec2Fleet],
                title: "EC2 Fleet",
                type: "string" as const,
              },
            ],
            title: "Provider",
            type: "string" as const,
          },
          ...(isEC2Provider && {
            providerAccount: ec2ProviderAccountField,
          }),
        },
        title: "",
        type: "object" as const,
      },
    },
    type: "object" as const,
  },
  uiSchema: {
    dockerProviderSettings: {
      containerPoolId: {
        "ui:allowDeselect": false,
        "ui:placeholder": "Select a pool",
      },
      poolMappingInfo: {
        "ui:elementWrapperCSS": textAreaCSS,
        "ui:placeholder": poolMappingInfo,
        "ui:readonly": true,
        "ui:rows": 6,
        "ui:widget": poolMappingInfo.length > 0 ? "textarea" : "hidden",
      },
      "ui:data-cy": "docker-provider-settings",
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      ...dockerProviderSettings.uiSchema,
    },
    ec2FleetProviderSettings: {
      items: {
        region: {
          "ui:allowDeselect": false,
          "ui:data-cy": "region-select",
          "ui:enumDisabled": fleetRegionsInUse,
        },
        "ui:displayTitle": "New AWS Region",
        ...ec2FleetProviderSettings.uiSchema,
      },
      "ui:addable": fleetRegionsInUse.length < awsRegions.length,
      "ui:addButtonText": "Add region settings",
      "ui:data-cy": "ec2-fleet-provider-settings",
      "ui:orderable": false,
      "ui:useExpandableCard": true,
    },
    provider: {
      providerName: {
        "ui:allowDeselect": false,
        "ui:data-cy": "provider-select",
      },
      "ui:ObjectFieldTemplate": CardFieldTemplate,
    },
    staticProviderSettings: {
      "ui:data-cy": "static-provider-settings",
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      ...staticProviderSettings.uiSchema,
    },
    taskHostOverrides: {
      "ui:data-cy": "task-host-overrides",
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      ...taskHostOverridesFields.uiSchema,
    },
  },
});
