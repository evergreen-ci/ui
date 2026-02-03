import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Body } from "@leafygreen-ui/typography";
import { add } from "date-fns";
import { StyledLink } from "@evg-ui/lib/components";
import { size } from "@evg-ui/lib/constants";
import widgets from "components/SpruceForm/Widgets";
import { hostUptimeDocumentationUrl } from "constants/externalResources";
import { abbreviateTimeZone, timeZones } from "constants/time";
import { MyPublicKeysQuery } from "gql/generated/types";
import {
  defaultStartDate,
  defaultStopDate,
  exemptionRange,
  getDefaultExpiration,
} from "./utils";

const today = new Date();

type HostUptimeProps = {
  hostUptimeWarnings?: {
    enabledHoursCount: number;
    warnings: string[];
  };
  isEditModal: boolean;
  timeZone: string;
};

const getHostUptimeSchema = ({
  hostUptimeWarnings,
  isEditModal,
  timeZone,
}: HostUptimeProps) => ({
  schema: {
    type: "object" as const,
    title: "",
    properties: {
      useDefaultUptimeSchedule: {
        type: "boolean" as const,
        title: `Use default host uptime schedule (Mon–Fri, 8am–8pm ${abbreviateTimeZone(timeZone)})`,
        default: true,
      },
      sleepSchedule: {
        type: "object" as const,
        title: "",
        properties: {
          enabledWeekdays: {
            type: "array" as const,
            title: "",
            default: [false, true, true, true, true, true, false],
            items: {
              type: "boolean" as const,
            },
          },
          timeSelection: {
            type: "object" as const,
            title: "",
            properties: {
              startTime: {
                type: "string" as const,
                title: "Start Time",
                default: defaultStartDate.toString(),
              },
              stopTime: {
                type: "string" as const,
                title: "Stop Time",
                default: defaultStopDate.toString(),
              },
              or: {
                type: "null" as const,
              },
              runContinuously: {
                type: "boolean" as const,
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
        type: "object" as const,
        title: "",
        properties: {
          timeZone: {
            type: "string",
            title: "Time Zone",
            default: timeZone,
            oneOf: timeZones.map(({ str, value }) => ({
              type: "string" as const,
              title: str,
              enum: [value],
            })),
          },

          uptimeHours: {
            type: "null" as const,
          },
        },
      },
      ...(isEditModal && {
        temporarilyExemptUntil: {
          type: "string" as const,
          title: "Temporary Sleep Schedule Exemption",
        },
      }),
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
      "ui:description": (
        <>
          Pausing hosts overnight reduces idle time outside of user-set hours.{" "}
          <StyledLink
            hideExternalIcon={false}
            href={hostUptimeDocumentationUrl}
          >
            Learn more about host sleep schedules
          </StyledLink>
          .
        </>
      ),
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
          "ui:widget": widgets.TimeWidget,
        },
        stopTime: {
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
      "ui:elementWrapperCSS": css`
        align-items: flex-end;
        display: flex;
        gap: ${size.xs};
        flex-wrap: wrap;

        > div {
          width: 40%;
        }

        > [role="alert"] {
          margin-top: 0;
          width: 100%;
        }
      `,
      timeZone: {
        "ui:allowDeselect": false,
        "ui:sizeVariant": "xsmall",
      },
      uptimeHours: {
        "ui:descriptionNode": (
          <Details
            // @ts-expect-error: FIXME. This comment was added by an automated script.
            totalUptimeHours={hostUptimeWarnings?.enabledHoursCount}
          />
        ),
        "ui:showLabel": false,
        "ui:warnings": hostUptimeWarnings?.warnings,
      },
    },
    temporarilyExemptUntil: {
      "ui:disableAfter": exemptionRange.disableAfter,
      "ui:disableBefore": exemptionRange.disableBefore,
      "ui:widget": "date",
    },
  },
});

const Details: React.FC<{ totalUptimeHours: number }> = ({
  totalUptimeHours,
}) => (
  <DetailsDiv data-cy="host-uptime-details">
    • {totalUptimeHours} host uptime hours per week
  </DetailsDiv>
);

const DetailsDiv = styled.div`
  margin-bottom: 21px;
  white-space: nowrap;
`;

type ExpirationProps = {
  disableExpirationCheckbox: boolean;
  hostUptimeWarnings?: {
    enabledHoursCount: number;
    warnings: string[];
  };
  isEditModal: boolean;
  noExpirationCheckboxTooltip?: string;
  permanentlyExempt?: boolean;
  timeZone: string;
};

export const getExpirationDetailsSchema = ({
  disableExpirationCheckbox,
  hostUptimeWarnings,
  isEditModal,
  noExpirationCheckboxTooltip,
  permanentlyExempt = false,
  timeZone,
}: ExpirationProps) => {
  const defaultExpiration = getDefaultExpiration();
  const hostUptime = getHostUptimeSchema({
    hostUptimeWarnings,
    isEditModal,
    timeZone,
  });
  return {
    schema: {
      title: "Expiration Details",
      type: "object" as const,
      properties: {
        noExpiration: {
          default: false,
          type: "boolean" as const,
          title: "",
          oneOf: [
            {
              type: "boolean" as const,
              title: "Expirable Host",
              enum: [false],
            },
            {
              type: "boolean" as const,
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
                  type: "string" as const,
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
                ...(!permanentlyExempt && { hostUptime: hostUptime.schema }),
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
      },
    },
  };
};

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
    type: "object" as const,
    title: "SSH Key",
    properties: {
      useExisting: {
        default: true,
        type: "boolean" as const,
        title: "",
        oneOf: [
          {
            type: "boolean" as const,
            title: "Use existing key",
            enum: [true],
          },
          {
            type: "boolean" as const,
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
                type: "string" as const,
                default: myPublicKeys?.length ? myPublicKeys[0]?.name : "",
                minLength: required ? 1 : 0,
                oneOf:
                  myPublicKeys?.length > 0
                    ? [
                        {
                          type: "string" as const,
                          title: "Select public key…",
                          enum: [""],
                        },
                        ...myPublicKeys.map((d) => ({
                          type: "string" as const,
                          title: d.name,
                          enum: [d.name],
                        })),
                      ]
                    : [
                        {
                          type: "string" as const,
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
                type: "string" as const,
                default: "",
                minLength: 1,
              },
              savePublicKey: {
                title: "Save Public Key",
                type: "boolean" as const,
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
                        type: "string" as const,
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
