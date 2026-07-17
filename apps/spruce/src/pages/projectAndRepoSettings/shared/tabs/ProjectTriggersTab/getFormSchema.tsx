import { TaskStatus } from "@evg-ui/lib/types/task";
import { GetFormSchema } from "components/SpruceForm";
import widgets from "components/SpruceForm/Widgets";
import { ProjectTriggerLevel } from "types/triggers";
import { form, ProjectType } from "../utils";

const { overrideRadioBox } = form;

export const getFormSchema = (
  projectType: ProjectType,
): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    description:
      "Configure upstream projects to cause tasks in this project to run.",
    type: "object" as const,
    ...overrideRadioBox(
      "triggers",
      ["Override Repo Triggers", "Default to Repo Triggers"],
      {
        default: [],
        items: {
          properties: {
            alias: {
              default: "",
              title: "Alias",
              type: "string" as const,
            },
            buildVariantRegex: {
              default: "",
              title: "Variant Regex",
              type: "string" as const,
            },
            configFile: {
              default: "",
              format: "noStartingOrTrailingWhitespace",
              minLength: 1,
              title: "Config File",
              type: "string" as const,
            },
            dateCutoff: {
              minimum: 0,
              title: "Date Cutoff",
              type: ["number", "null"],
            },
            level: {
              default: ProjectTriggerLevel.TASK,
              oneOf: [
                {
                  enum: [ProjectTriggerLevel.TASK],
                  title: "Task",
                  type: "string" as const,
                },
                {
                  enum: [ProjectTriggerLevel.BUILD],
                  title: "Build",
                  type: "string" as const,
                },
                {
                  enum: [ProjectTriggerLevel.PUSH],
                  title: "Push",
                  type: "string" as const,
                },
              ],
              title: "Level",
              type: "string" as const,
            },
            project: {
              default: "",
              format: "noStartingOrTrailingWhitespace",
              minLength: 1,
              title: "Project",
              type: "string" as const,
            },
            status: {
              default: "",
              oneOf: [
                {
                  enum: [""],
                  title: "All",
                  type: "string" as const,
                },
                {
                  enum: [TaskStatus.Succeeded],
                  title: "Success",
                  type: "string" as const,
                },
                {
                  enum: [TaskStatus.Failed],
                  title: "Failure",
                  type: "string" as const,
                },
              ],
              title: "Status",
              type: "string" as const,
            },
            taskRegex: {
              default: "",
              title: "Task Regex",
              type: "string" as const,
            },
            unscheduleDownstreamVersions: {
              title: "Unschedule Downstream Versions",
              type: "boolean" as const,
            },
          },
          type: "object" as const,
        },
        type: "array" as const,
      },
    ),
  },
  uiSchema: {
    repoData: {
      triggers: {
        "ui:showLabel": false,
        "ui:useExpandableCard": true,
      },
      "ui:orderable": false,
      "ui:readonly": true,
    },
    triggers: {
      items: {
        alias: {
          "ui:description":
            "Patch alias to filter variants/tasks in this project.",
          "ui:optional": true,
        },
        buildVariantRegex: {
          "ui:description":
            "Only matching variants in the upstream project will invoke trigger.",
          "ui:optional": true,
        },
        configFile: {
          "ui:data-cy": "config-file-input",
          "ui:description":
            "The path to the downstream project's config file. This may be the same as the main project configuration file but does not have to be.",
          "ui:placeholder": ".evergreen.yml",
        },
        dateCutoff: {
          "ui:description":
            "Commits older than this number of days will not invoke trigger.",
          "ui:optional": true,
        },
        level: {
          "ui:allowDeselect": false,
          "ui:description":
            "Task and build levels will trigger based on the completion of a task or a build in the upstream project. Push level triggers will trigger once a commit is pushed to the upstream project. This is helpful if the upstream project does not regularly run or create commit tasks.",
        },
        project: {
          "ui:data-cy": "project-input",
          "ui:description":
            "The upstream project identifier to listen to for commits",
        },
        status: {
          "ui:allowDeselect": false,
          "ui:description":
            "Specify which status of the upstream build or task should trigger a downstream version. This applicable to build and task level triggers only.",
        },
        taskRegex: {
          "ui:description":
            "Only matching tasks in the upstream project will invoke trigger.",
          "ui:optional": true,
        },
        "ui:displayTitle": "New Project Trigger",
        "ui:label": false,
        unscheduleDownstreamVersions: {
          "ui:bold": true,
          "ui:description":
            "Downstream versions created by this trigger will be deactivated by default",
          "ui:optional": true,
        },
      },
      "ui:addButtonText": "Add project trigger",
      "ui:orderable": false,
      "ui:showLabel": false,
      "ui:useExpandableCard": true,
    },
    triggersOverride: {
      "ui:showLabel": false,
      "ui:widget":
        projectType === ProjectType.AttachedProject
          ? widgets.RadioBoxWidget
          : "hidden",
    },
  },
});
