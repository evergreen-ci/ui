import { css } from "@emotion/react";
import Badge from "@leafygreen-ui/badge";
import widgets from "components/SpruceForm/Widgets";
import { prettifyTimeZone } from "constants/fieldMaps";
import { size } from "constants/tokens";

const defaultStartTime = new Date();
defaultStartTime.setHours(8, 0, 0, 0);
const defaultEndTime = new Date();
defaultEndTime.setHours(20, 0, 0, 0);

type HostUptimeProps = {
  hostUptimeErrors: { [key: string]: string[] };
  timeZone?: string;
  totalUptimeHours?: number;
};

export const getHostUptimeSchema = ({
  hostUptimeErrors,
  timeZone,
  totalUptimeHours,
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
      timeZone: {
        type: "null" as "null",
      },
      totalUptimeHours: {
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
    sleepSchedule: {
      enabledWeekdays: {
        "ui:addable": false,
        "ui:showLabel": false,
        "ui:widget": widgets.DayPickerWidget,
      },
      timeSelection: {
        "ui:fieldSetCSS": css`
          align-items: flex-end;
          display: flex;
          gap: ${size.xs};

          > * {
            width: fit-content;
          }

          > h6 {
            font-size: 0.8rem;
            font-weight: normal;
            margin-top: 0;
            padding-bottom: ${size.s};
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
        runContinuously: {
          "ui:elementWrapperCSS": css`
            padding-bottom: 10px;
            width: fit-content;
            white-space: nowrap;
          `,
        },
      },
    },
    timeZone: {
      "ui:descriptionNode": <TimeZone timeZone={timeZone} />,
      "ui:showLabel": false,
    },
    totalUptimeHours: {
      "ui:descriptionNode": (
        <TotalUptimeHours totalUptimeHours={totalUptimeHours} />
      ),
      "ui:showLabel": false,
      ...hostUptimeErrors,
    },
  },
});

const TotalUptimeHours: React.FC<{ totalUptimeHours: number }> = ({
  totalUptimeHours,
}) => <>Count: {totalUptimeHours}</>;

const TimeZone: React.FC<{ timeZone: string }> = ({ timeZone }) => (
  <>
    All times are displayed in{" "}
    <Badge>{prettifyTimeZone.get(timeZone) ?? timeZone}</Badge>
  </>
);
