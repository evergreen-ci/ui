import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Body } from "@leafygreen-ui/typography";
import { add } from "date-fns";
import { StyledLink } from "@evg-ui/lib/components/styles";
import { size } from "@evg-ui/lib/constants/tokens";
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
              sleepSchedule: { readOnly: true },
              useDefaultUptimeSchedule: { enum: [true] },
            },
          },
        ],
      },
    },
    properties: {
      details: {
        properties: {
          timeZone: {
            default: timeZone,
            oneOf: timeZones.map(({ str, value }) => ({
              enum: [value],
              title: str,
              type: "string" as const,
            })),
            title: "Time Zone",
            type: "string",
          },

          uptimeHours: {
            type: "null" as const,
          },
        },
        title: "",
        type: "object" as const,
      },
      sleepSchedule: {
        properties: {
          enabledWeekdays: {
            default: [false, true, true, true, true, true, false],
            items: {
              type: "boolean" as const,
            },
            title: "",
            type: "array" as const,
          },
          timeSelection: {
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
            properties: {
              or: {
                type: "null" as const,
              },
              runContinuously: {
                title: "Run continuously for enabled days",
                type: "boolean" as const,
              },
              startTime: {
                default: defaultStartDate.toString(),
                title: "Start Time",
                type: "string" as const,
              },
              stopTime: {
                default: defaultStopDate.toString(),
                title: "Stop Time",
                type: "string" as const,
              },
            },
            title: "",
            type: "object" as const,
          },
        },
        title: "",
        type: "object" as const,
      },
      useDefaultUptimeSchedule: {
        default: true,
        title: `Use default host uptime schedule (Mon–Fri, 8am–8pm ${abbreviateTimeZone(timeZone)})`,
        type: "boolean" as const,
      },
      ...(isEditModal && {
        temporarilyExemptUntil: {
          title: "Temporary Sleep Schedule Exemption",
          type: "string" as const,
        },
      }),
    },
    title: "",
    type: "object" as const,
  },
  uiSchema: {
    details: {
      timeZone: {
        "ui:allowDeselect": false,
        "ui:sizeVariant": "xsmall",
      },
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
    sleepSchedule: {
      enabledWeekdays: {
        "ui:addable": false,
        "ui:showLabel": false,
        "ui:widget": widgets.DayPickerWidget,
      },
      timeSelection: {
        or: {
          "ui:descriptionNode": <Body>or</Body>,
          "ui:showLabel": false,
        },
        runContinuously: {
          "ui:elementWrapperCSS": css`
            margin-bottom: 0;
            white-space: nowrap;
            width: fit-content;
          `,
        },
        startTime: {
          "ui:widget": widgets.TimeWidget,
        },
        stopTime: {
          "ui:widget": widgets.TimeWidget,
        },
        "ui:elementWrapperCSS": css`
          align-items: center;
          display: flex;
          gap: ${size.xs};
          > * {
            width: fit-content;
          }
        `,
      },
    },
    temporarilyExemptUntil: {
      "ui:description":
        "During a temporary exemption, the uptime schedule will not take effect at all, so Evergreen will not stop/start your host unless you do so manually. This is useful if you have a one-off need to keep your host on without interruption.",
      "ui:disableAfter": exemptionRange.disableAfter,
      "ui:disableBefore": exemptionRange.disableBefore,
      "ui:widget": "date",
    },
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
      dependencies: {
        noExpiration: {
          oneOf: [
            {
              properties: {
                expiration: {
                  default: defaultExpiration,
                  minLength: 6,
                  title: "Expiration",
                  type: "string" as const,
                },
                noExpiration: {
                  enum: [false],
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
      properties: {
        noExpiration: {
          default: false,
          oneOf: [
            {
              enum: [false],
              title: "Expirable Host",
              type: "boolean" as const,
            },
            {
              enum: [true],
              title: "Unexpirable Host",
              type: "boolean" as const,
            },
          ],
          title: "",
          type: "boolean" as const,
        },
      },
      title: "Expiration Details",
      type: "object" as const,
    },
    uiSchema: {
      expiration: {
        "ui:disableAfter": add(today, { days: 30 }),
        "ui:disableBefore": add(today, { days: 1 }),
        "ui:widget": "date-time",
      },
      hostUptime: hostUptime.uiSchema,
      noExpiration: {
        "ui:data-cy": "expirable-radio-box",
        "ui:enumDisabled": disableExpirationCheckbox ? [true] : null,
        "ui:widget": widgets.RadioBoxWidget,
      },
      "ui:warnings":
        disableExpirationCheckbox && noExpirationCheckboxTooltip
          ? [noExpirationCheckboxTooltip]
          : [],
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
    dependencies: {
      useExisting: {
        oneOf: [
          {
            properties: {
              publicKeyNameDropdown: {
                default: myPublicKeys?.length ? myPublicKeys[0]?.name : "",
                minLength: required ? 1 : 0,
                oneOf:
                  myPublicKeys?.length > 0
                    ? [
                        {
                          enum: [""],
                          title: "Select public key…",
                          type: "string" as const,
                        },
                        ...myPublicKeys.map((d) => ({
                          enum: [d.name],
                          title: d.name,
                          type: "string" as const,
                        })),
                      ]
                    : [
                        {
                          enum: [""],
                          title: "No keys available.",
                          type: "string" as const,
                        },
                      ],
                title: "Choose key",
                type: "string" as const,
              },
              useExisting: {
                enum: [true],
              },
            },
          },
          {
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
                      newPublicKeyName: {
                        default: "",
                        minLength: 1,
                        title: "Key name",
                        type: "string" as const,
                      },
                      savePublicKey: {
                        enum: [true],
                      },
                    },
                  },
                ],
              },
            },
            properties: {
              newPublicKey: {
                default: "",
                minLength: 1,
                title: "Public key",
                type: "string" as const,
              },
              savePublicKey: {
                default: false,
                title: "Save Public Key",
                type: "boolean" as const,
              },
              useExisting: {
                enum: [false],
              },
            },
          },
        ],
      },
    },
    properties: {
      useExisting: {
        default: true,
        oneOf: [
          {
            enum: [true],
            title: "Use existing key",
            type: "boolean" as const,
          },
          {
            enum: [false],
            title: "Add new key",
            type: "boolean" as const,
          },
        ],
        title: "",
        type: "boolean" as const,
      },
    },
    title: "SSH Key",
    type: "object" as const,
  },
  uiSchema: {
    newPublicKey: {
      "ui:data-cy": "key-value-text-area",
      "ui:elementWrapperCSS": textAreaWrapperClassName,
      "ui:widget": "textarea",
    },
    publicKeyNameDropdown: {
      "ui:allowDeselect": false,
      "ui:data-cy": "key-select",
      "ui:description":
        canEditSshKeys && myPublicKeys?.length === 0
          ? "No keys available."
          : "",
      "ui:disabled": myPublicKeys?.length === 0,
      "ui:elementWrapperCSS": dropdownWrapperClassName,
    },
    "ui:disabled": !canEditSshKeys,
    useExisting: {
      "ui:description": !canEditSshKeys
        ? "SSH keys can only be added when the host is running."
        : "",
      "ui:widget": widgets.RadioBoxWidget,
    },
  },
});

const dropdownWrapperClassName = css`
  max-width: 225px;
`;
const textAreaWrapperClassName = css`
  max-width: 675px;
`;
