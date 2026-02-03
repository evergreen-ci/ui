import { StyledLink } from "@evg-ui/lib/components";
import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import { versionControlDocumentationUrl } from "constants/externalResources";
import { showRecreatableTaskEnvironments } from "constants/featureFlags";
import { form, ProjectType } from "../utils";
import {
  DeactivateStepbackTaskField,
  DeleteProjectField,
  RepoConfigField,
  RepotrackerField,
} from "./Fields";
import { GeneralFormState } from "./types";

const { placeholderIf, radioBoxOptions } = form;

export const getFormSchema = (
  projectId: string,
  projectType: ProjectType,
  identifierHasChanges: boolean,
  initialOwner: string,
  initialRepo: string,
  repoData?: GeneralFormState,
): ReturnType<GetFormSchema> => ({
  fields: {
    deactivateStepbackTask: DeactivateStepbackTaskField,
    deleteProjectField: DeleteProjectField,
    repoConfigField: RepoConfigField,
    repotrackerField: RepotrackerField,
  },
  schema: {
    type: "object" as const,
    properties: {
      generalConfiguration: {
        type: "object" as const,
        title: "General Configuration",
        properties: {
          ...(projectType !== ProjectType.Repo && {
            enabled: {
              type: "boolean" as const,
              oneOf: radioBoxOptions(["Enabled", "Disabled"]),
            },
          }),
          repositoryInfo: {
            type: "object" as const,
            title: "Repository Info",
            required: ["owner", "repo"],
            properties: {
              owner: {
                type: "string" as const,
                title: "GitHub Organization",
                format: "noSpaces",
                // @ts-expect-error: FIXME. This comment was added by an automated script.
                minLength: getMinLength(projectType, repoData, "owner"),
                default: "",
              },
              repo: {
                type: "string" as const,
                title: "Repository",
                format: "noSpaces",
                // @ts-expect-error: FIXME. This comment was added by an automated script.
                minLength: getMinLength(projectType, repoData, "repo"),
                default: "",
              },
            },
          },
          ...(projectType !== ProjectType.Repo && {
            branch: {
              type: "string" as const,
              title: "Branch Name",
              format: "noStartingOrTrailingWhitespace",
            },
          }),
          other: {
            type: "object" as const,
            title: "Other",
            properties: {
              displayName: {
                type: "string" as const,
                title: "Display Name",
                format: "noStartingOrTrailingWhitespace",
              },
              ...(projectType !== ProjectType.Repo && {
                projectID: {
                  type: "string" as const,
                  title: "Project ID",
                },
                identifier: {
                  type: "string" as const,
                  title: "Identifier",
                  default: "",
                  minLength: 1,
                  // Don't invalidate form based on initial data
                  format: identifierHasChanges
                    ? "noSpecialCharacters"
                    : "noSpaces",
                },
              }),
              batchTime: {
                type: ["number", "null"],
                title: "Batch Time",
                minimum: 0,
              },
              remotePath: {
                type: "string" as const,
                title: "Config File",
                format: "noStartingOrTrailingWhitespace",
              },
              spawnHostScriptPath: {
                type: "string" as const,
                title: "Spawn Host Script Path",
                format: "noStartingOrTrailingWhitespace",
              },
              versionControlEnabled: {
                type: ["boolean", "null"],
                title: "Version Control",
                oneOf: radioBoxOptions(
                  ["Enabled", "Disabled"],
                  // @ts-expect-error: FIXME. This comment was added by an automated script.
                  repoData?.generalConfiguration?.other?.versionControlEnabled,
                ),
              },
            },
          },
        },
      },
      projectFlags: {
        type: "object" as const,
        title: "Project Flags",
        properties: {
          dispatchingDisabled: {
            type: ["boolean", "null"],
            title: "Dispatching",
            oneOf: radioBoxOptions(
              ["Enabled", "Disabled"],
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              repoData?.projectFlags?.dispatchingDisabled,
              true,
            ),
          },
          repotracker: {
            type: "object" as const,
            title: "Repotracker Settings",
            properties: {
              repotrackerDisabled: {
                type: ["boolean", "null"],
                title: "Repotracker",
                oneOf: radioBoxOptions(
                  ["Enabled", "Disabled"],
                  // @ts-expect-error: FIXME. This comment was added by an automated script.
                  repoData?.projectFlags?.repotracker?.repotrackerDisabled,
                  true,
                ),
              },
              ...(projectType !== ProjectType.Repo && {
                forceRun: {
                  type: "null" as const,
                },
              }),
            },
          },
          debug: {
            type: "object" as const,
            title: "Debug Settings",
            properties: {
              debugSpawnHostsDisabled: {
                type: ["boolean", "null"],
                title: "Debug Spawn Hosts",
                oneOf: radioBoxOptions(
                  ["Enabled", "Disabled"],
                  // @ts-expect-error: FIXME. This comment was added by an automated script.
                  repoData?.projectFlags?.debug?.debugSpawnHostsDisabled,
                  true,
                ),
              },
            },
          },
          scheduling: {
            type: "object" as const,
            title: "Scheduling Settings",
            properties: {
              deactivatePrevious: {
                type: ["boolean", "null"],
                title: "Old Task on Success",
                oneOf: radioBoxOptions(
                  ["Unschedule", "Don't Unschedule"],
                  // @ts-expect-error: FIXME. This comment was added by an automated script.
                  repoData?.projectFlags?.scheduling?.deactivatePrevious,
                ),
              },
              stepbackDisabled: {
                type: ["boolean", "null"],
                title: "Stepback",
                oneOf: radioBoxOptions(
                  ["Enabled", "Disabled"],
                  // @ts-expect-error: FIXME. This comment was added by an automated script.
                  repoData?.projectFlags?.scheduling?.stepbackDisabled,
                  true,
                ),
              },
              stepbackBisection: {
                type: ["boolean", "null"],
                title: "Stepback Bisection",
                oneOf: radioBoxOptions(
                  ["Enabled", "Disabled"],
                  // @ts-expect-error: FIXME. This comment was added by an automated script.
                  repoData?.projectFlags?.scheduling?.stepbackBisection,
                ),
              },
              deactivateStepback: {
                type: "null" as const,
              },
            },
          },
          patch: {
            type: "object" as const,
            title: "Patch Settings",
            description:
              "Sets if users are allowed to create patches for this branch.",
            properties: {
              patchingDisabled: {
                type: ["boolean", "null"],
                title: "Patching",
                oneOf: radioBoxOptions(
                  ["Enabled", "Disabled"],
                  // @ts-expect-error: FIXME. This comment was added by an automated script.
                  repoData?.projectFlags?.patch?.patchingDisabled,
                  true,
                ),
              },
            },
          },
        },
      },
      historicalTaskDataCaching: {
        type: "object" as const,
        title: "Historical Task Data Caching Info",
        properties: {
          disabledStatsCache: {
            type: ["boolean", "null"],
            title: "Cache Daily Task Statistics",
            oneOf: radioBoxOptions(
              ["Enabled", "Disabled"],
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              repoData?.historicalTaskDataCaching?.disabledStatsCache,
              true,
            ),
          },
        },
      },
      ...(projectType !== ProjectType.Repo && {
        delete: {
          type: "object" as const,
          title: "Delete Project",
          properties: {
            deleteProject: {
              type: "null" as const,
            },
          },
        },
      }),
    },
  },
  uiSchema: {
    generalConfiguration: {
      "ui:rootFieldId": "generalConfiguration",
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      enabled: {
        "ui:widget": widgets.RadioBoxWidget,
        "ui:showLabel": false,
        "ui:data-cy": "enabled-radio-box",
      },
      repositoryInfo: {
        "ui:field": "repoConfigField",
        options: {
          initialOwner,
          initialRepo,
          projectId,
          projectType,
          repoName: repoData?.generalConfiguration?.repositoryInfo?.repo,
          repoOwner: repoData?.generalConfiguration?.repositoryInfo?.owner,
        },
        owner: {
          ...placeholderIf(
            // @ts-expect-error: FIXME. This comment was added by an automated script.
            repoData?.generalConfiguration?.repositoryInfo?.owner,
          ),
        },
        repo: {
          "ui:data-cy": "repo-input",
          ...placeholderIf(
            // @ts-expect-error: FIXME. This comment was added by an automated script.
            repoData?.generalConfiguration?.repositoryInfo?.repo,
          ),
        },
      },
      branch: {
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        ...placeholderIf(repoData?.generalConfiguration?.branch),
      },
      other: {
        displayName: {
          "ui:data-cy": "display-name-input",
        },
        projectID: {
          "ui:widget": widgets.CopyableWidget,
          "ui:description":
            "Immutable ID for use in project configuration, such as setting up AWS roles.",
        },
        identifier: {
          "ui:data-cy": "identifier-input",
          ...(identifierHasChanges && {
            "ui:warnings": [
              "Updates made to the project identifier will change the identifier used for the CLI, inter-project dependencies, etc. Project users should be made aware of this change, as the old identifier will no longer work.",
            ],
          }),
        },
        batchTime: {
          "ui:description":
            "The interval of time (in minutes) that Evergreen should wait in between activating the latest version.",
          "ui:data-cy": "batch-time-input",
          ...placeholderIf(
            repoData?.generalConfiguration?.other?.batchTime === null
              ? "0"
              : (repoData?.generalConfiguration?.other?.batchTime ?? ""),
          ),
        },
        remotePath: {
          "ui:description":
            "Path to yaml file where project tasks, variants, and other settings are defined.",
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          ...placeholderIf(repoData?.generalConfiguration?.other?.remotePath),
        },
        spawnHostScriptPath: {
          "ui:description":
            "This is the bash setup script to optionally run on spawn hosts created from tasks.",
          "ui:data-cy": "spawn-host-input",
          "ui:optional": true,
          ...placeholderIf(
            // @ts-expect-error: FIXME. This comment was added by an automated script.
            repoData?.generalConfiguration?.other?.spawnHostScriptPath,
          ),
        },
        versionControlEnabled: {
          "ui:widget": widgets.RadioBoxWidget,
          "ui:description": VersionControlEnabledDescription,
        },
      },
    },
    projectFlags: {
      "ui:rootFieldId": "projectFlags",
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      dispatchingDisabled: {
        "ui:widget": widgets.RadioBoxWidget,
        "ui:description": "Sets if any tasks can be dispatched.",
      },
      debug: {
        debugSpawnHostsDisabled: {
          // TODO DEVPROD-25833: Unhide this field when the feature is ready
          "ui:widget": showRecreatableTaskEnvironments
            ? widgets.RadioBoxWidget
            : "hidden",
          "ui:description":
            "Sets if project tasks can create debug spawn hosts.", // TODO DEVPROD-25820: Add link to debug spawn hosts documentation
        },
      },
      repotracker: {
        repotrackerDisabled: {
          "ui:widget": widgets.RadioBoxWidget,
          "ui:description": `The repotracker will be triggered from GitHub push events sent via webhook. 
            This creates mainline builds for merged commits.`,
        },
        forceRun: {
          "ui:field": "repotrackerField",
          "ui:showLabel": false,
          options: { projectId },
        },
      },
      scheduling: {
        deactivatePrevious: {
          "ui:widget": widgets.RadioBoxWidget,
          "ui:description":
            "When unscheduled, tasks from previous revisions will be unscheduled when the equivalent task in a newer commit finishes successfully.",
        },
        stepbackDisabled: {
          "ui:widget": widgets.RadioBoxWidget,
          "ui:description":
            "Disabling this setting will override all enabled stepback settings for the project. Disabling stepback won't cancel any active stepback tasks, but it will prevent any future ones.",
        },
        stepbackBisection: {
          "ui:widget": widgets.RadioBoxWidget,
          "ui:description":
            "Bisection will cause your stepback to activate the midway task between the last failing task and last passing task.",
          "ui:data-cy": "stepback-bisect-group",
        },
        deactivateStepback: {
          "ui:field": "deactivateStepbackTask",
          "ui:showLabel": false,
          options: { projectId },
        },
      },
      patch: {
        patchingDisabled: {
          "ui:widget": widgets.RadioBoxWidget,
          "ui:showLabel": false,
        },
      },
    },
    historicalTaskDataCaching: {
      "ui:rootFieldId": "historicalTaskDataCaching",
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      disabledStatsCache: {
        "ui:widget": widgets.RadioBoxWidget,
        "ui:description":
          "Task execution statistics aggregated by project, build variant, distro, task name, and task creation date.",
      },
    },
    delete: {
      "ui:rootFieldId": "removeProject",
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      deleteProject: {
        "ui:field": "deleteProjectField",
        "ui:showLabel": false,
        options: { projectId },
      },
    },
  },
});

const VersionControlEnabledDescription = (
  <>
    Enabling Version Control allows{" "}
    <StyledLink href={versionControlDocumentationUrl}>
      select properties
    </StyledLink>{" "}
    to be defined in this project&rsquo;s config YAML in addition to the UI.
    Version controlled configurations must be defined in the project&rsquo;s
    main YAML file to take effect, and cannot be placed in an included YAML
    file.
  </>
);

const getMinLength = (
  projectType: ProjectType,
  repoData: GeneralFormState,
  value: string,
): number => {
  const repoGeneral = repoData?.generalConfiguration;
  const repository = repoGeneral?.repositoryInfo;

  if (projectType === ProjectType.AttachedProject) {
    // if the project defaults to the repo, allow the value to be defined there instead
    switch (value) {
      case "owner":
        return repository?.owner ? 0 : 1;
      case "repo":
        return repository?.repo ? 0 : 1;
      default:
        return 1;
    }
  }
  return 1;
};
