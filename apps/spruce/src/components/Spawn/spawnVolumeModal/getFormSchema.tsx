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
    type: "object" as const,
    properties: {
      requiredVolumeInformation: {
        type: "object" as const,
        title: "Required Volume Information",
        required: ["size"],
        properties: {
          size: {
            title: "Size (GiB)",
            type: "number" as const,
            default:
              maxSpawnableLimit > DEFAULT_VOLUME_SIZE
                ? DEFAULT_VOLUME_SIZE
                : maxSpawnableLimit,
            minimum: 1,
            maximum: maxSpawnableLimit,
          },
          availabilityZone: {
            title: "Region",
            type: "string" as const,
            default: availabilityZones?.[0] ?? "",
            oneOf: availabilityZones.map((r) => ({
              type: "string" as const,
              title: r,
              enum: [r],
            })),
          },
          type: {
            title: "Type",
            type: "string" as const,
            default: types?.[0] ?? "",
            oneOf: types.map((t) => ({
              type: "string" as const,
              title: t,
              enum: [t],
            })),
          },
        },
      },
      optionalVolumeInformation: {
        type: "object" as const,
        title: "Optional Volume Information",
        properties: {
          expirationDetails: {
            title: "",
            type: "object" as const,
            properties: {
              expiration: {
                type: "string" as const,
                title: "Expiration",
                default: getDefaultExpiration(),
              },
              noExpiration: {
                type: "boolean" as const,
                title: "Never expire",
                default: false,
              },
            },
            dependencies: {
              noExpiration: {
                oneOf: [
                  {
                    properties: {
                      noExpiration: {
                        enum: [true],
                      },
                      expiration: {
                        readOnly: true,
                      },
                    },
                  },
                  {
                    properties: {
                      noExpiration: {
                        enum: [false],
                      },
                      expiration: {
                        readOnly: false,
                      },
                    },
                  },
                ],
              },
            },
          },
          mountToHost: {
            title: "Mount to Host",
            type: "string" as const,
            default: "",
            oneOf: [
              {
                type: "string" as const,
                title: "Select host…",
                enum: [""],
              },
              ...hosts.map((h) => ({
                type: "string" as const,
                title: h.displayName,
                enum: [h.id],
              })),
            ],
          },
        },
      },
    },
  },
  uiSchema: {
    requiredVolumeInformation: {
      size: {
        "ui:description": `The max spawnable volume size is ${maxSpawnableLimit} GiB.`,
        "ui:data-cy": "volume-size-input",
      },
      availabilityZone: {
        "ui:allowDeselect": false,
        "ui:data-cy": "availability-zone-select",
      },
      type: {
        "ui:allowDeselect": false,
        "ui:data-cy": "type-select",
      },
    },
    optionalVolumeInformation: {
      expirationDetails: {
        "ui:ObjectFieldTemplate": ExpirationRow,
        expiration: {
          "ui:disableBefore": add(today, { days: 1 }),
          "ui:disableAfter": add(today, { days: 30 }),
          "ui:widget": "date-time",
        },
        noExpiration: {
          "ui:disabled": disableExpirationCheckbox,
          "ui:tooltipDescription": noExpirationCheckboxTooltip ?? "",
          "ui:elementWrapperCSS": checkboxCSS,
        },
      },
      mountToHost: {
        "ui:allowDeselect": false,
        "ui:disabled": hosts.length === 0,
        "ui:description": hosts.length === 0 ? "No hosts available." : "",
        "ui:data-cy": "host-select",
      },
    },
  },
});

const checkboxCSS = css`
  margin-bottom: 0;
`;

const today = new Date();
