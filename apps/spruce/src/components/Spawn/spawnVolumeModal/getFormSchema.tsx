import { css } from "@emotion/react";
import { add } from "date-fns";
import { DEFAULT_VOLUME_SIZE } from "components/Spawn/spawnHostModal/constants";
import { GetFormSchema } from "components/SpruceForm/types";
import { ExpirationRow } from "../ExpirationRow";
import { getDefaultExpiration } from "../utils";

interface Props {
  availabilityZones: string[];
  disableExpirationCheckbox: boolean;
  hosts: { id: string; displayName: string }[];
  maxSpawnableLimit: number;
  noExpirationCheckboxTooltip: string;
  types: string[];
}

export const getFormSchema = ({
  availabilityZones,
  disableExpirationCheckbox,
  hosts,
  maxSpawnableLimit,
  noExpirationCheckboxTooltip,
  types,
}: Props): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    properties: {
      optionalVolumeInformation: {
        properties: {
          expirationDetails: {
            dependencies: {
              noExpiration: {
                oneOf: [
                  {
                    properties: {
                      expiration: {
                        readOnly: true,
                      },
                      noExpiration: {
                        enum: [true],
                      },
                    },
                  },
                  {
                    properties: {
                      expiration: {
                        readOnly: false,
                      },
                      noExpiration: {
                        enum: [false],
                      },
                    },
                  },
                ],
              },
            },
            properties: {
              expiration: {
                default: getDefaultExpiration(),
                title: "Expiration",
                type: "string" as const,
              },
              noExpiration: {
                default: false,
                title: "Never expire",
                type: "boolean" as const,
              },
            },
            title: "",
            type: "object" as const,
          },
          mountToHost: {
            default: "",
            oneOf: [
              {
                enum: [""],
                title: "Select host…",
                type: "string" as const,
              },
              ...hosts.map((h) => ({
                enum: [h.id],
                title: h.displayName,
                type: "string" as const,
              })),
            ],
            title: "Mount to Host",
            type: "string" as const,
          },
        },
        title: "Optional Volume Information",
        type: "object" as const,
      },
      requiredVolumeInformation: {
        properties: {
          availabilityZone: {
            default: availabilityZones?.[0] ?? "",
            oneOf: availabilityZones.map((r) => ({
              enum: [r],
              title: r,
              type: "string" as const,
            })),
            title: "Region",
            type: "string" as const,
          },
          size: {
            default:
              maxSpawnableLimit > DEFAULT_VOLUME_SIZE
                ? DEFAULT_VOLUME_SIZE
                : maxSpawnableLimit,
            maximum: maxSpawnableLimit,
            minimum: 1,
            title: "Size (GiB)",
            type: "number" as const,
          },
          type: {
            default: types?.[0] ?? "",
            oneOf: types.map((t) => ({
              enum: [t],
              title: t,
              type: "string" as const,
            })),
            title: "Type",
            type: "string" as const,
          },
        },
        required: ["size"],
        title: "Required Volume Information",
        type: "object" as const,
      },
    },
    type: "object" as const,
  },
  uiSchema: {
    optionalVolumeInformation: {
      expirationDetails: {
        expiration: {
          "ui:disableAfter": add(today, { days: 30 }),
          "ui:disableBefore": add(today, { days: 1 }),
          "ui:widget": "date-time",
        },
        noExpiration: {
          "ui:disabled": disableExpirationCheckbox,
          "ui:elementWrapperCSS": checkboxCSS,
          "ui:tooltipDescription": noExpirationCheckboxTooltip ?? "",
        },
        "ui:ObjectFieldTemplate": ExpirationRow,
      },
      mountToHost: {
        "ui:allowDeselect": false,
        "ui:data-cy": "host-select",
        "ui:description": hosts.length === 0 ? "No hosts available." : "",
        "ui:disabled": hosts.length === 0,
      },
    },
    requiredVolumeInformation: {
      availabilityZone: {
        "ui:allowDeselect": false,
        "ui:data-cy": "availability-zone-select",
      },
      size: {
        "ui:data-cy": "volume-size-input",
        "ui:description": `The max spawnable volume size is ${maxSpawnableLimit} GiB.`,
      },
      type: {
        "ui:allowDeselect": false,
        "ui:data-cy": "type-select",
      },
    },
  },
});

const checkboxCSS = css`
  margin-bottom: 0;
`;

const today = new Date();
