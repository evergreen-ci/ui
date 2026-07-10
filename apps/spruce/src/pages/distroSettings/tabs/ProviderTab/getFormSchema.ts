import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import { Provider } from "gql/generated/types";
import {
  staticProviderSettings,
  ec2FleetProviderSettings,
  ec2ProviderAccountField,
  taskHostOverridesFields,
} from "./schemaFields";

export const getFormSchema = ({
  awsRegions,
  fleetRegionsInUse,
  isEC2Provider,
}: {
  awsRegions: string[];
  fleetRegionsInUse: string[];
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
        "ui:data-cy": "provider-select",
      },
    },
    staticProviderSettings: {
      "ui:data-cy": "static-provider-settings",
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      ...staticProviderSettings.uiSchema,
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
    taskHostOverrides: {
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      "ui:data-cy": "task-host-overrides",
      ...taskHostOverridesFields.uiSchema,
    },
  },
});
