import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import { Provider, ContainerPool } from "gql/generated/types";
import {
  dockerProviderSettings,
  staticProviderSettings,
  ec2FleetProviderSettings,
  ec2OnDemandProviderSettings,
  ec2ProviderAccountField,
} from "./schemaFields";
import { textAreaCSS } from "./styles";

export const getFormSchema = ({
  awsRegions,
  fleetRegionsInUse,
  isEC2Provider,
  onDemandRegionsInUse,
  poolMappingInfo,
  pools,
}: {
  awsRegions: string[];
  fleetRegionsInUse: string[];
  onDemandRegionsInUse: string[];
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
              {
                type: "string" as const,
                title: "EC2 On-Demand",
                enum: [Provider.Ec2OnDemand],
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
            },
          },
          {
            properties: {
              provider: {
                properties: {
                  providerName: {
                    enum: [Provider.Ec2OnDemand],
                  },
                },
              },
              ec2OnDemandProviderSettings: {
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
                    ...ec2OnDemandProviderSettings.schema,
                  },
                },
              },
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
        "ui:data-cy": "provider-select",
      },
    },
    staticProviderSettings: {
      "ui:data-cy": "static-provider-settings",
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      ...staticProviderSettings.uiSchema,
    },
    dockerProviderSettings: {
      "ui:data-cy": "docker-provider-settings",
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
      "ui:data-cy": "ec2-fleet-provider-settings",
      "ui:useExpandableCard": true,
      "ui:addButtonText": "Add region settings",
      "ui:addable": fleetRegionsInUse.length < awsRegions.length,
      "ui:orderable": false,
      items: {
        "ui:displayTitle": "New AWS Region",
        region: {
          "ui:data-cy": "region-select",
          "ui:allowDeselect": false,
          "ui:enumDisabled": fleetRegionsInUse,
        },
        ...ec2FleetProviderSettings.uiSchema,
      },
    },
    ec2OnDemandProviderSettings: {
      "ui:data-cy": "ec2-on-demand-provider-settings",
      "ui:useExpandableCard": true,
      "ui:addButtonText": "Add region settings",
      "ui:addable": onDemandRegionsInUse.length < awsRegions.length,
      "ui:orderable": false,
      items: {
        "ui:displayTitle": "New AWS Region",
        region: {
          "ui:data-cy": "region-select",
          "ui:allowDeselect": false,
          "ui:enumDisabled": onDemandRegionsInUse,
        },
        ...ec2OnDemandProviderSettings.uiSchema,
      },
    },
  },
});
