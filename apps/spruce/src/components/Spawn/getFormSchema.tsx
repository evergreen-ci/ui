import { Body } from "@leafygreen-ui/typography";
import { add } from "date-fns";
import { StyledLink } from "@evg-ui/lib/components/styles";
import widgets from "components/SpruceForm/Widgets";
import { hostUptimeDocumentationUrl } from "constants/externalResources";
import { abbreviateTimeZone, timeZones } from "constants/time";
import { MyPublicKeysQuery } from "gql/generated/types";
import styles from "./getFormSchema.module.css";
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
        "ui:elementWrapperCSS": timeSelectionWrapperCSS,
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
          "ui:elementWrapperCSS": runContinuouslyWrapperCSS,
        },
      },
    },
    details: {
      "ui:elementWrapperCSS": detailsWrapperCSS,
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
      "ui:description":
        "During a temporary exemption, the uptime schedule will not take effect at all, so Evergreen will not stop/start your host unless you do so manually. This is useful if you have a one-off need to keep your host on without interruption.",
      "ui:disableAfter": exemptionRange.disableAfter,
      "ui:disableBefore": exemptionRange.disableBefore,
      "ui:widget": "date",
    },
  },
});

const Details: React.FC<{ totalUptimeHours: number }> = ({
  totalUptimeHours,
}) => (
  <div className={styles.detailsDiv} data-testid="host-uptime-details">
    • {totalUptimeHours} host uptime hours per week
  </div>
);

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
      "ui:warnings":
        disableExpirationCheckbox && noExpirationCheckboxTooltip
          ? [noExpirationCheckboxTooltip]
          : [],
      noExpiration: {
        "ui:enumDisabled": disableExpirationCheckbox ? [true] : null,
        "ui:data-testid": "expirable-radio-box",
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
      "ui:elementWrapperCSS": dropdownWrapperCSS,
      "ui:data-testid": "key-select",
      "ui:allowDeselect": false,
      "ui:disabled": myPublicKeys?.length === 0,
      "ui:description":
        canEditSshKeys && myPublicKeys?.length === 0
          ? "No keys available."
          : "",
    },
    newPublicKey: {
      "ui:widget": "textarea",
      "ui:elementWrapperCSS": textAreaWrapperCSS,
      "ui:data-testid": "key-value-text-area",
    },
  },
});

/* SpruceForm registers "ui:elementWrapperCSS" through its Emotion bridge
   (SpruceForm/utils), so these stay object styles until the page-level
   consumers migrate off Emotion. */
const timeSelectionWrapperCSS = {
  alignItems: "center",
  display: "flex",
  gap: "8px",
  "> *": {
    width: "fit-content",
  },
};
const runContinuouslyWrapperCSS = {
  marginBottom: "0px",
  whiteSpace: "nowrap",
  width: "fit-content",
};
const detailsWrapperCSS = {
  alignItems: "flex-end",
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
  "> div": {
    width: "40%",
  },
  '> [role="alert"]': {
    marginTop: "0px",
    width: "100%",
  },
};
const dropdownWrapperCSS = { maxWidth: "225px" };
const textAreaWrapperCSS = { maxWidth: "675px" };
