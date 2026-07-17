import { StyledLink } from "@evg-ui/lib/components/styles";
import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import {
  debugSpawnHostsDocumentationUrl,
  runEveryMainlineCommitDocumentationUrl,
  versionControlDocumentationUrl,
} from "constants/externalResources";
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
    properties: {
      generalConfiguration: {
        properties: {
          ...(projectType !== ProjectType.Repo && {
            enabled: {
              oneOf: radioBoxOptions(["Enabled", "Disabled"]),
              type: "boolean" as const,
            },
          }),
          repositoryInfo: {
            properties: {
              owner: {
                default: "",
                format: "noSpaces",
                // @ts-expect-error: FIXME. This comment was added by an automated script.
                minLength: getMinLength(projectType, repoData, "owner"),
                title: "GitHub Organization",
                type: "string" as const,
              },
              repo: {
                default: "",
                format: "noSpaces",
                // @ts-expect-error: FIXME. This comment was added by an automated script.
                minLength: getMinLength(projectType, repoData, "repo"),
                title: "Repository",
                type: "string" as const,
              },
            },
            required: ["owner", "repo"],
            title: "Repository Info",
            type: "object" as const,
          },
          ...(projectType !== ProjectType.Repo && {
            branch: {
              format: "noStartingOrTrailingWhitespace",
              title: "Branch Name",
              type: "string" as const,
            },
          }),
          other: {
            properties: {
              displayName: {
                format: "noStartingOrTrailingWhitespace",
                title: "Display Name",
                type: "string" as const,
              },
              ...(projectType !== ProjectType.Repo && {
                identifier: {
                  default: "",
                  // Don't invalidate form based on initial data
                  format: identifierHasChanges
                    ? "noSpecialCharacters"
                    : "noSpaces",
                  minLength: 1,
                  title: "Identifier",
                  type: "string" as const,
                },
                projectID: {
                  title: "Project ID",
                  type: "string" as const,
                },
              }),
              batchTime: {
                minimum: 0,
                title: "Batch Time",
                type: ["number", "null"],
              },
              remotePath: {
                format: "noStartingOrTrailingWhitespace",
                title: "Config File",
                type: "string" as const,
              },
              spawnHostScriptPath: {
                format: "noStartingOrTrailingWhitespace",
                title: "Spawn Host Script Path",
                type: "string" as const,
              },
              versionControlEnabled: {
                oneOf: radioBoxOptions(
                  ["Enabled", "Disabled"],
                  // @ts-expect-error: FIXME. This comment was added by an automated script.
                  repoData?.generalConfiguration?.other?.versionControlEnabled,
                ),
                title: "Version Control",
                type: ["boolean", "null"],
              },
            },
            title: "Other",
            type: "object" as const,
          },
        },
        title: "General Configuration",
        type: "object" as const,
      },
      historicalTaskDataCaching: {
        properties: {
          disabledStatsCache: {
            oneOf: radioBoxOptions(
              ["Enabled", "Disabled"],
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              repoData?.historicalTaskDataCaching?.disabledStatsCache,
              true,
            ),
            title: "Cache Daily Task Statistics",
            type: ["boolean", "null"],
          },
        },
        title: "Historical Task Data Caching Info",
        type: "object" as const,
      },
      projectFlags: {
        properties: {
          debug: {
            properties: {
              debugSpawnHostsDisabled: {
                oneOf: radioBoxOptions(
                  ["Enabled", "Disabled"],
                  // @ts-expect-error: FIXME. This comment was added by an automated script.
                  repoData?.projectFlags?.debug?.debugSpawnHostsDisabled,
                  true,
                ),
                title: "Debug Spawn Hosts",
                type: ["boolean", "null"],
              },
            },
            title: "Debug Settings",
            type: "object" as const,
          },
          dispatchingDisabled: {
            oneOf: radioBoxOptions(
              ["Enabled", "Disabled"],
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              repoData?.projectFlags?.dispatchingDisabled,
              true,
            ),
            title: "Dispatching",
            type: ["boolean", "null"],
          },
          patch: {
            description:
              "Sets if users are allowed to create patches for this branch.",
            properties: {
              patchingDisabled: {
                oneOf: radioBoxOptions(
                  ["Enabled", "Disabled"],
                  // @ts-expect-error: FIXME. This comment was added by an automated script.
                  repoData?.projectFlags?.patch?.patchingDisabled,
                  true,
                ),
                title: "Patching",
                type: ["boolean", "null"],
              },
            },
            title: "Patch Settings",
            type: "object" as const,
          },
          repotracker: {
            properties: {
              repotrackerDisabled: {
                oneOf: radioBoxOptions(
                  ["Enabled", "Disabled"],
                  // @ts-expect-error: FIXME. This comment was added by an automated script.
                  repoData?.projectFlags?.repotracker?.repotrackerDisabled,
                  true,
                ),
                title: "Repotracker",
                type: ["boolean", "null"],
              },
              ...(projectType !== ProjectType.Repo && {
                forceRun: {
                  type: "null" as const,
                },
              }),
              runEveryMainlineCommit: {
                oneOf: radioBoxOptions(
                  ["Enabled", "Disabled"],
                  // @ts-expect-error: FIXME. This comment was added by an automated script.
                  repoData?.projectFlags?.repotracker?.runEveryMainlineCommit,
                ),
                title: "Run Every Mainline Commit",
                type: ["boolean", "null"] as const,
              },
              waterfallDisabled: {
                oneOf: radioBoxOptions(
                  ["Enabled", "Disabled"],
                  // @ts-expect-error: FIXME. This comment was added by an automated script.
                  repoData?.projectFlags?.repotracker?.waterfallDisabled,
                  true,
                ),
                title: "Waterfall",
                type: ["boolean", "null"],
              },
            },
            title: "Repotracker Settings",
            type: "object" as const,
          },
          scheduling: {
            properties: {
              deactivatePrevious: {
                oneOf: radioBoxOptions(
                  ["Unschedule", "Don't Unschedule"],
                  // @ts-expect-error: FIXME. This comment was added by an automated script.
                  repoData?.projectFlags?.scheduling?.deactivatePrevious,
                ),
                title: "Old Task on Success",
                type: ["boolean", "null"],
              },
              deactivateStepback: {
                type: "null" as const,
              },
              stepbackBisection: {
                oneOf: radioBoxOptions(
                  ["Enabled", "Disabled"],
                  // @ts-expect-error: FIXME. This comment was added by an automated script.
                  repoData?.projectFlags?.scheduling?.stepbackBisection,
                ),
                title: "Stepback Bisection",
                type: ["boolean", "null"],
              },
              stepbackDisabled: {
                oneOf: radioBoxOptions(
                  ["Enabled", "Disabled"],
                  // @ts-expect-error: FIXME. This comment was added by an automated script.
                  repoData?.projectFlags?.scheduling?.stepbackDisabled,
                  true,
                ),
                title: "Stepback",
                type: ["boolean", "null"],
              },
            },
            title: "Scheduling Settings",
            type: "object" as const,
          },
        },
        title: "Project Flags",
        type: "object" as const,
      },
      ...(projectType !== ProjectType.Repo && {
        delete: {
          properties: {
            deleteProject: {
              type: "null" as const,
            },
          },
          title: "Delete Project",
          type: "object" as const,
        },
      }),
    },
    type: "object" as const,
  },
  uiSchema: {
    delete: {
      deleteProject: {
        options: { projectId },
        "ui:field": "deleteProjectField",
        "ui:showLabel": false,
      },
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      "ui:rootFieldId": "removeProject",
    },
    generalConfiguration: {
      branch: {
        ...placeholderIf(repoData?.generalConfiguration?.branch),
      },
      enabled: {
        "ui:data-cy": "enabled-radio-box",
        "ui:showLabel": false,
        "ui:widget": widgets.RadioBoxWidget,
      },
      other: {
        batchTime: {
          "ui:data-cy": "batch-time-input",
          "ui:description":
            "The interval of time (in minutes) that Evergreen should wait in between activating the latest version.",
          ...placeholderIf(
            repoData?.generalConfiguration?.other?.batchTime === null
              ? "0"
              : (repoData?.generalConfiguration?.other?.batchTime ?? ""),
          ),
        },
        displayName: {
          "ui:data-cy": "display-name-input",
        },
        identifier: {
          "ui:data-cy": "identifier-input",
          ...(identifierHasChanges && {
            "ui:warnings": [
              "Updates made to the project identifier will change the identifier used for the CLI, inter-project dependencies, etc. Project users should be made aware of this change, as the old identifier will no longer work.",
            ],
          }),
        },
        projectID: {
          "ui:description":
            "Immutable ID for use in project configuration, such as setting up AWS roles.",
          "ui:widget": widgets.CopyableWidget,
        },
        remotePath: {
          "ui:description":
            "Path to yaml file where project tasks, variants, and other settings are defined.",
          ...placeholderIf(repoData?.generalConfiguration?.other?.remotePath),
        },
        spawnHostScriptPath: {
          "ui:data-cy": "spawn-host-input",
          "ui:description":
            "This is the bash setup script to optionally run on spawn hosts created from tasks.",
          "ui:optional": true,
          ...placeholderIf(
            repoData?.generalConfiguration?.other?.spawnHostScriptPath,
          ),
        },
        versionControlEnabled: {
          "ui:description": VersionControlEnabledDescription,
          "ui:widget": widgets.RadioBoxWidget,
        },
      },
      repositoryInfo: {
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
            repoData?.generalConfiguration?.repositoryInfo?.owner,
          ),
        },
        repo: {
          "ui:data-cy": "repo-input",
          ...placeholderIf(
            repoData?.generalConfiguration?.repositoryInfo?.repo,
          ),
        },
        "ui:field": "repoConfigField",
      },
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      "ui:rootFieldId": "generalConfiguration",
    },
    historicalTaskDataCaching: {
      disabledStatsCache: {
        "ui:description":
          "Task execution statistics aggregated by project, build variant, distro, task name, and task creation date.",
        "ui:widget": widgets.RadioBoxWidget,
      },
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      "ui:rootFieldId": "historicalTaskDataCaching",
    },
    projectFlags: {
      debug: {
        debugSpawnHostsDisabled: {
          "ui:description": (
            <>
              Sets if project tasks can create{" "}
              <StyledLink href={debugSpawnHostsDocumentationUrl}>
                debug spawn hosts
              </StyledLink>
              . Make sure you review{" "}
              <StyledLink
                href={`${debugSpawnHostsDocumentationUrl}#prerequisites-and-limitations`}
              >
                Prerequisites and Limitations
              </StyledLink>{" "}
              before enabling.
            </>
          ),
          "ui:widget": widgets.RadioBoxWidget,
        },
      },
      dispatchingDisabled: {
        "ui:description": "Sets if any tasks can be dispatched.",
        "ui:widget": widgets.RadioBoxWidget,
      },
      patch: {
        patchingDisabled: {
          "ui:showLabel": false,
          "ui:widget": widgets.RadioBoxWidget,
        },
      },
      repotracker: {
        forceRun: {
          options: { projectId },
          "ui:field": "repotrackerField",
          "ui:showLabel": false,
        },
        repotrackerDisabled: {
          "ui:description": `The repotracker will be triggered from GitHub push events sent via webhook.
            This creates mainline builds for merged commits.`,
          "ui:widget": widgets.RadioBoxWidget,
        },
        runEveryMainlineCommit: {
          "ui:data-cy": "run-every-mainline-commit-radio-box",
          "ui:description": RunEveryMainlineCommitDescription,
          "ui:widget": widgets.RadioBoxWidget,
        },
        waterfallDisabled: {
          "ui:description":
            "Disables automatic task activation on the waterfall. Tasks will still appear but will be unscheduled by default.",
          "ui:widget": widgets.RadioBoxWidget,
        },
      },
      scheduling: {
        deactivatePrevious: {
          "ui:description":
            "When unscheduled, tasks from previous revisions will be unscheduled when the equivalent task in a newer commit finishes successfully.",
          "ui:widget": widgets.RadioBoxWidget,
        },
        deactivateStepback: {
          options: { projectId },
          "ui:field": "deactivateStepbackTask",
          "ui:showLabel": false,
        },
        stepbackBisection: {
          "ui:data-cy": "stepback-bisect-group",
          "ui:description":
            "Bisection will cause your stepback to activate the midway task between the last failing task and last passing task.",
          "ui:widget": widgets.RadioBoxWidget,
        },
        stepbackDisabled: {
          "ui:description":
            "Disabling this setting will override all enabled stepback settings for the project. Disabling stepback won't cancel any active stepback tasks, but it will prevent any future ones.",
          "ui:widget": widgets.RadioBoxWidget,
        },
      },
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      "ui:rootFieldId": "projectFlags",
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

const RunEveryMainlineCommitDescription = (
  <>
    By default, only the latest repotracker version is activated periodically to
    avoid redundant builds. Enable this to activate every mainline commit
    version.{" "}
    <StyledLink href={runEveryMainlineCommitDocumentationUrl}>
      Learn more
    </StyledLink>
  </>
);
