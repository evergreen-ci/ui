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
    type: "object" as const,
    properties: {
      provider: {
        type: "object" as const,
        title: "",
        properties: {
          providerName: {
            type: "string" as const,
            title: "Provider",
            oneOf: [
              {
                type: "string" as const,
                title: "Static IP/VM",
                enum: [Provider.Static],
              },
              {
                type: "string" as const,
                title: "Docker",
                enum: [Provider.Docker],
              },
              {
                type: "string" as const,
                title: "EC2 Fleet",
                enum: [Provider.Ec2Fleet],
              },
            ],
          },
          ...(isEC2Provider && {
            providerAccount: ec2ProviderAccountField,
          }),
        },
      },
    },
    dependencies: {
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
                type: "object" as const,
                title: "",
                properties: staticProviderSettings.schema,
              },
            },
          },
          {
            properties: {
              provider: {
                properties: {
                  providerName: {
                    enum: [Provider.Docker],
                  },
                },
              },
              dockerProviderSettings: {
                type: "object" as const,
                title: "",
                properties: {
                  containerPoolId: {
                    type: "string" as const,
                    title: "Container Pool ID",
                    default: "",
                    oneOf: pools.map((p) => ({
                      type: "string" as const,
                      title: p.id,
                      enum: [p.id],
                    })),
                  },
                  poolMappingInfo: {
                    type: "string" as const,
                    title: "Pool Mapping Information",
                  },
                  ...dockerProviderSettings.schema,
                },
              },
            },
          },
          {
            properties: {
              provider: {
                properties: {
                  providerName: {
                    enum: [Provider.Ec2Fleet],
                  },
                },
              },
              ec2FleetProviderSettings: {
                type: "array" as const,
                minItems: 1,
                title: "",
                items: {
                  type: "object" as const,
                  properties: {
                    region: {
                      type: "string" as const,
                      title: "Region",
                      default: "",
                      oneOf: awsRegions.map((r) => ({
                        type: "string" as const,
                        title: r,
                        enum: [r],
                      })),
                    },
                    ...ec2FleetProviderSettings.schema,
                  },
                },
              },
              taskHostOverrides: taskHostOverridesFields.schema,
            },
          },
        ],
      },
    },
  },
  uiSchema: {
    provider: {
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      providerName: {
        "ui:allowDeselect": false,
        "ui:data-testid": "provider-select",
      },
    },
    staticProviderSettings: {
      "ui:data-testid": "static-provider-settings",
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      ...staticProviderSettings.uiSchema,
    },
    dockerProviderSettings: {
      "ui:data-testid": "docker-provider-settings",
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      containerPoolId: {
        "ui:allowDeselect": false,
        "ui:placeholder": "Select a pool",
      },
      poolMappingInfo: {
        "ui:widget": poolMappingInfo.length > 0 ? "textarea" : "hidden",
        "ui:placeholder": poolMappingInfo,
        "ui:elementWrapperCSS": textAreaCSS,
        "ui:rows": 6,
        "ui:readonly": true,
      },
      ...dockerProviderSettings.uiSchema,
    },
    ec2FleetProviderSettings: {
      "ui:data-testid": "ec2-fleet-provider-settings",
      "ui:useExpandableCard": true,
      "ui:addButtonText": "Add region settings",
      "ui:addable": fleetRegionsInUse.length < awsRegions.length,
      "ui:orderable": false,
      items: (itemData?: { displayTitle?: string }) => ({
        "ui:title": itemData?.displayTitle || "New AWS Region",
        region: {
          "ui:data-testid": "region-select",
          "ui:allowDeselect": false,
          "ui:enumDisabled": fleetRegionsInUse,
        },
        ...ec2FleetProviderSettings.uiSchema,
      }),
    },
    taskHostOverrides: {
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      "ui:data-testid": "task-host-overrides",
      ...taskHostOverridesFields.uiSchema,
    },
  },
});
