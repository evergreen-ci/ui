import { GetFormSchema } from "components/SpruceForm";
import widgets from "components/SpruceForm/Widgets";
import { timeZones } from "constants/time";
import { form, ProjectType } from "../utils";
import { IntervalSpecifier } from "./types";

const { overrideRadioBox } = form;

export const getFormSchema = (
  projectType: ProjectType,
  timezone: string,
): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    type: "object" as const,
    description:
      "Configure tasks to run at a consistent interval within this project. " +
      "This will create a new version that can be seen on the Spruce commits page, " +
      "regardless of whether or not a new commit has been pushed since the last interval, " +
      "as opposed to batchtime which will activate the tasks on existing commit versions.",
    ...overrideRadioBox(
      "periodicBuilds",
      ["Override Repo Commands", "Default to Repo Commands"],
      {
        type: "array" as const,
        default: [],
        items: {
          type: "object" as const,
          properties: {
            interval: {
              type: "object" as const,
              title: "Interval Specifier",
              properties: {
                specifier: {
                  type: "string" as const,
                  title: "",
                  default: IntervalSpecifier.Hours,
                  oneOf: [
                    {
                      type: "string" as const,
                      title: "Hours",
                      enum: [IntervalSpecifier.Hours],
                    },
                    {
                      type: "string" as const,
                      title: "Cron",
                      enum: [IntervalSpecifier.Cron],
                    },
                  ],
                },
              },
              dependencies: {
                specifier: {
                  oneOf: [
                    {
                      properties: {
                        specifier: {
                          enum: [IntervalSpecifier.Hours],
                        },
                        intervalHours: {
                          type: "number" as const,
                          title: "Interval",
                          minimum: 1,
                          default: 24,
                        },
                      },
                    },
                    {
                      properties: {
                        specifier: {
                          enum: [IntervalSpecifier.Cron],
                        },
                        cron: {
                          type: "string" as const,
                          title: "Cron Expression",
                        },
                      },
                    },
                  ],
                },
              },
            },
            configFile: {
              type: "string" as const,
              title: "Config File",
              minLength: 1,
              default: "",
              format: "noStartingOrTrailingWhitespace",
            },
            alias: {
              type: "string" as const,
              title: "Alias",
              default: "",
            },
            message: {
              type: "string" as const,
              title: "Message",
              default: "",
            },
            timezone: {
              type: "string" as const,
              title: "Time Zone",
              default: timezone,
              oneOf: [
                ...timeZones.map(({ str, value }) => ({
                  type: "string" as const,
                  title: str,
                  enum: [value],
                })),
                {
                  type: "string" as const,
                  title: "Local Time",
                  enum: [""],
                },
              ],
            },
            nextRunTime: {
              type: "string" as const,
              title: "Next Run Time",
              default: new Date().toString(),
            },
          },
        },
      },
    ),
  },
  uiSchema: {
    periodicBuildsOverride: {
      "ui:widget":
        projectType === ProjectType.AttachedProject
          ? widgets.RadioBoxWidget
          : "hidden",
      "ui:showLabel": false,
    },
    periodicBuilds: {
      "ui:addButtonText": "Add Periodic Build",
      "ui:orderable": false,
      "ui:showLabel": false,
      "ui:useExpandableCard": true,
      items: {
        "ui:displayTitle": "New Periodic Build",
        "ui:label": false,
        interval: {
          specifier: {
            "ui:widget": widgets.SegmentedControlWidget,
          },
          intervalHours: {
            "ui:data-cy": "interval-input",
            "ui:description": "Number of hours between runs.",
          },
        },
        configFile: {
          "ui:data-cy": "config-file-input",
          "ui:placeholder": ".evergreen.yml",
        },
        alias: {
          "ui:optional": true,
          "ui:placeholder": "my_task_alias",
        },
        message: {
          "ui:optional": true,
          "ui:placeholder": "A periodic build",
        },
        timezone: {
          "ui:description":
            "Next Run Time is configured using the time zone set in User Preferences.",
          "ui:disabled": true,
        },
        nextRunTime: {
          "ui:disableBefore": new Date(),
          "ui:widget": "date-time",
        },
      },
    },
    repoData: {
      "ui:orderable": false,
      "ui:readonly": true,
      periodicBuilds: {
        "ui:showLabel": false,
        "ui:useExpandableCard": true,
        items: {
          nextRunTime: {
            "ui:widget": "date-time",
          },
        },
      },
    },
  },
});
