import { css } from "@emotion/react";
import Badge from "@leafygreen-ui/badge";
import { Body } from "@leafygreen-ui/typography";
import { add } from "date-fns";
import widgets from "components/SpruceForm/Widgets";
import { prettifyTimeZone } from "constants/fieldMaps";
import { size } from "constants/tokens";
import { MyPublicKeysQuery } from "gql/generated/types";
import { isProduction } from "utils/environmentVariables";
import {
  defaultStartDate,
  defaultStopDate,
  getDefaultExpiration,
} from "./utils";

const today = new Date();

type HostUptimeProps = {
  hostUptimeValidation?: {
    enabledHoursCount: number;
    errors: string[];
    warnings: string[];
  };
  timeZone?: string;
};

const getHostUptimeSchema = ({
  hostUptimeValidation,
  timeZone,
}: HostUptimeProps) => ({
  schema: {
    type: "object" as "object",
    title: "",
    properties: {
      useDefaultUptimeSchedule: {
        type: "boolean" as "boolean",
        title: "Use default host uptime schedule (Mon–Fri, 8am–8pm)",
        default: true,
      },
      sleepSchedule: {
        type: "object" as "object",
        title: "",
        properties: {
          enabledWeekdays: {
            type: "array" as "array",
            title: "",
            default: [false, true, true, true, true, true, false],
            items: {
              type: "boolean" as "boolean",
            },
          },
          timeSelection: {
            type: "object" as "object",
            title: "",
            properties: {
              startTime: {
                type: "string" as "string",
                title: "Start Time",
                default: defaultStartDate.toString(),
              },
              stopTime: {
                type: "string" as "string",
                title: "Stop Time",
                default: defaultStopDate.toString(),
              },
              or: {
                type: "null" as "null",
              },
              runContinuously: {
                type: "boolean" as "boolean",
                title: "Run continuously for enabled days",
              },
            },
            dependencies: {
              runContinuously: {
                oneOf: [
                  {
                    properties: {
                      runContinuously: { enum: [false] },
                    },
                  },
                  {
                    properties: {
                      runContinuously: { enum: [true] },
                      startTime: { readOnly: true },
                      stopTime: { readOnly: true },
                    },
                  },
                ],
              },
            },
          },
        },
      },
      details: {
        type: "null" as "null",
      },
    },
    dependencies: {
      useDefaultUptimeSchedule: {
        oneOf: [
          {
            properties: {
              useDefaultUptimeSchedule: { enum: [false] },
            },
          },
          {
            properties: {
              useDefaultUptimeSchedule: { enum: [true] },
              sleepSchedule: { readOnly: true },
            },
          },
        ],
      },
    },
  },
  uiSchema: {
    useDefaultUptimeSchedule: {
      "ui:bold": true,
    },
    sleepSchedule: {
      enabledWeekdays: {
        "ui:addable": false,
        "ui:showLabel": false,
        "ui:widget": widgets.DayPickerWidget,
      },
      timeSelection: {
        "ui:elementWrapperCSS": css`
          align-items: center;
          display: flex;
          gap: ${size.xs};
          > * {
            width: fit-content;
          }
        `,
        startTime: {
          "ui:format": "HH:mm",
          "ui:useUtc": false,
          "ui:widget": widgets.TimeWidget,
        },
        stopTime: {
          "ui:format": "HH:mm",
          "ui:useUtc": false,
          "ui:widget": widgets.TimeWidget,
        },
        or: {
          "ui:showLabel": false,
          "ui:descriptionNode": <Body>or</Body>,
        },
        runContinuously: {
          "ui:elementWrapperCSS": css`
            margin-bottom: 0;
            white-space: nowrap;
            width: fit-content;
          `,
        },
      },
    },
    details: {
      "ui:descriptionNode": (
        <Details
          // @ts-ignore: FIXME. This comment was added by an automated script.
          timeZone={timeZone}
          // @ts-ignore: FIXME. This comment was added by an automated script.
          totalUptimeHours={hostUptimeValidation?.enabledHoursCount}
        />
      ),
      "ui:showLabel": false,
      "ui:warnings": hostUptimeValidation?.warnings,
      "ui:errors": hostUptimeValidation?.errors,
    },
  },
});

const Details: React.FC<{ timeZone: string; totalUptimeHours: number }> = ({
  timeZone,
  totalUptimeHours,
}) => (
  <div data-cy="host-uptime-details">
    All times are displayed in{" "}
    <Badge>{prettifyTimeZone.get(timeZone) ?? timeZone}</Badge> •{" "}
    {totalUptimeHours} host uptime hours per week
  </div>
);

type ExpirationProps = {
  disableExpirationCheckbox: boolean;
  hostUptimeValidation?: {
    enabledHoursCount: number;
    errors: string[];
    warnings: string[];
  };
  noExpirationCheckboxTooltip?: string;
  timeZone?: string;
};

export const getExpirationDetailsSchema = ({
  disableExpirationCheckbox,
  hostUptimeValidation,
  noExpirationCheckboxTooltip,
  timeZone,
}: ExpirationProps) => {
  const defaultExpiration = getDefaultExpiration();
  const hostUptime = getHostUptimeSchema({ hostUptimeValidation, timeZone });
  return {
    schema: {
      title: "Expiration Details",
      type: "object" as "object",
      properties: {
        noExpiration: {
          default: false,
          type: "boolean" as "boolean",
          title: "",
          oneOf: [
            {
              type: "boolean" as "boolean",
              title: "Expirable Host",
              enum: [false],
            },
            {
              type: "boolean" as "boolean",
              title: "Unexpirable Host",
              enum: [true],
            },
          ],
        },
      },
      dependencies: {
        noExpiration: {
          oneOf: [
            {
              properties: {
                noExpiration: {
                  enum: [false],
                },
                expiration: {
                  type: "string" as "string",
                  title: "Expiration",
                  default: defaultExpiration,
                  minLength: 6,
                },
              },
            },
            {
              properties: {
                noExpiration: {
                  enum: [true],
                },
                ...(!isProduction() && { hostUptime: hostUptime.schema }),
              },
            },
          ],
        },
      },
    },
    uiSchema: {
      "ui:tooltipTitle": noExpirationCheckboxTooltip ?? "",
      noExpiration: {
        "ui:enumDisabled": disableExpirationCheckbox ? [true] : null,
        "ui:data-cy": "expirable-radio-box",
        "ui:widget": widgets.RadioBoxWidget,
      },
      hostUptime: hostUptime.uiSchema,
      expiration: {
        "ui:disableBefore": add(today, { days: 1 }),
        "ui:disableAfter": add(today, { days: 30 }),
        "ui:widget": "date-time",
        "ui:elementWrapperCSS": datePickerCSS,
      },
    },
  };
};

const datePickerCSS = css`
  position: relative;
  z-index: 1;
`;

type PublicKeyProps = {
  canEditSshKeys?: boolean;
  myPublicKeys: MyPublicKeysQuery["myPublicKeys"];
  required?: boolean;
};

export const getPublicKeySchema = ({
  canEditSshKeys = true,
  myPublicKeys,
  required = true,
}: PublicKeyProps) => ({
  schema: {
    type: "object" as "object",
    title: "SSH Key",
    properties: {
      useExisting: {
        default: true,
        type: "boolean" as "boolean",
        title: "",
        oneOf: [
          {
            type: "boolean" as "boolean",
            title: "Use existing key",
            enum: [true],
          },
          {
            type: "boolean" as "boolean",
            title: "Add new key",
            enum: [false],
          },
        ],
      },
    },
    dependencies: {
      useExisting: {
        oneOf: [
          {
            properties: {
              useExisting: {
                enum: [true],
              },
              publicKeyNameDropdown: {
                title: "Choose key",
                type: "string" as "string",
                default: myPublicKeys?.length ? myPublicKeys[0]?.name : "",
                minLength: required ? 1 : 0,
                oneOf:
                  myPublicKeys?.length > 0
                    ? [
                        {
                          type: "string" as "string",
                          title: "Select public key…",
                          enum: [""],
                        },
                        ...myPublicKeys.map((d) => ({
                          type: "string" as "string",
                          title: d.name,
                          enum: [d.name],
                        })),
                      ]
                    : [
                        {
                          type: "string" as "string",
                          title: "No keys available.",
                          enum: [""],
                        },
                      ],
              },
            },
          },
          {
            properties: {
              useExisting: {
                enum: [false],
              },
              newPublicKey: {
                title: "Public key",
                type: "string" as "string",
                default: "",
                minLength: 1,
              },
              savePublicKey: {
                title: "Save Public Key",
                type: "boolean" as "boolean",
                default: false,
              },
            },
            dependencies: {
              savePublicKey: {
                oneOf: [
                  {
                    properties: {
                      savePublicKey: {
                        enum: [false],
                      },
                    },
                  },
                  {
                    properties: {
                      savePublicKey: {
                        enum: [true],
                      },
                      newPublicKeyName: {
                        title: "Key name",
                        type: "string" as "string",
                        default: "",
                        minLength: 1,
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    },
  },
  uiSchema: {
    "ui:disabled": !canEditSshKeys,
    useExisting: {
      "ui:widget": widgets.RadioBoxWidget,
      "ui:description": !canEditSshKeys
        ? "SSH keys can only be added when the host is running."
        : "",
    },
    publicKeyNameDropdown: {
      "ui:elementWrapperCSS": dropdownWrapperClassName,
      "ui:data-cy": "key-select",
      "ui:allowDeselect": false,
      "ui:disabled": myPublicKeys?.length === 0,
      "ui:description":
        canEditSshKeys && myPublicKeys?.length === 0
          ? "No keys available."
          : "",
    },
    newPublicKey: {
      "ui:widget": "textarea",
      "ui:elementWrapperCSS": textAreaWrapperClassName,
      "ui:data-cy": "key-value-text-area",
    },
  },
});

const dropdownWrapperClassName = css`
  max-width: 225px;
`;
const textAreaWrapperClassName = css`
  max-width: 675px;
`;
