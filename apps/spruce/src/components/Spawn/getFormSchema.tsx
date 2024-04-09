import { css } from "@emotion/react";
import Badge from "@leafygreen-ui/badge";
import { Body } from "@leafygreen-ui/typography";
import widgets from "components/SpruceForm/Widgets";
import { prettifyTimeZone } from "constants/fieldMaps";
import { size } from "constants/tokens";

const defaultStartTime = new Date();
defaultStartTime.setHours(8, 0, 0, 0);
const defaultEndTime = new Date();
defaultEndTime.setHours(20, 0, 0, 0);

type HostUptimeProps = {
  hostUptimeValidation?: {
    enabledHoursCount: number;
    errors: string[];
    warnings: string[];
  };
  timeZone?: string;
  totalUptimeHours?: number;
};

export const getHostUptimeSchema = ({
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
                default: defaultStartTime.toString(),
              },
              endTime: {
                type: "string" as "string",
                title: "End Time",
                default: defaultEndTime.toString(),
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
                      endTime: { readOnly: true },
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
        "ui:fieldSetCSS": css`
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
        endTime: {
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
          timeZone={timeZone}
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
  <>
    All times are displayed in{" "}
    <Badge>{prettifyTimeZone.get(timeZone) ?? timeZone}</Badge> •{" "}
    {totalUptimeHours} host uptime hours per week
  </>
);
