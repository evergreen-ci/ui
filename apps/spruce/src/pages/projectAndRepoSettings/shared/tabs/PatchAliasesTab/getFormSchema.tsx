import { css } from "@emotion/react";
import { StyledLink } from "@evg-ui/lib/components";
import { size } from "@evg-ui/lib/constants";
import { GetFormSchema } from "components/SpruceForm";
import { AccordionFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import { patchAliasesDocumentationUrl } from "constants/externalResources";
import { PatchStatus } from "types/patch";
import { alias, form, PatchTriggerAliasStatus, ProjectType } from "../utils";
import { TaskSpecifier } from "./types";

const {
  baseProps: { task, variant },
  patchAliasArray,
} = alias;
const { overrideRadioBox } = form;

export const getFormSchema = (
  projectType: ProjectType,
): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    type: "object" as const,
    properties: {
      patchAliases: {
        title: "Patch Aliases",
        ...overrideRadioBox(
          "aliases",
          ["Override Repo Patch Aliases", "Default to Repo Patch Aliases"],
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          patchAliasArray.schema,
        ),
      },
      patchTriggerAliases: {
        title: "Patch Trigger Aliases",
        ...overrideRadioBox(
          "aliases",
          [
            "Override Repo Patch Trigger Aliases",
            "Default to Repo Patch Trigger Aliases",
          ],
          {
            type: "array" as const,
            items: {
              type: "object" as const,
              properties: {
                alias: {
                  type: "string" as const,
                  title: "Alias",
                  default: "",
                  minLength: 1,
                  format: "noStartingOrTrailingWhitespace",
                },
                childProjectIdentifier: {
                  type: "string" as const,
                  title: "Project",
                  default: "",
                  minLength: 1,
                  format: "noStartingOrTrailingWhitespace",
                },
                parentAsModule: {
                  type: "string" as const,
                  title: "Module",
                  format: "noStartingOrTrailingWhitespace",
                },
                status: {
                  type: "string" as const,
                  title: "Wait on",
                  default: "",
                  oneOf: [
                    {
                      type: "string" as const,
                      title: "Select event…",
                      enum: [""],
                    },
                    {
                      type: "string" as const,
                      title: PatchTriggerAliasStatus["*"],
                      enum: ["*"],
                    },
                    {
                      type: "string" as const,
                      title: PatchTriggerAliasStatus[PatchStatus.Success],
                      enum: [PatchStatus.Success],
                    },
                    {
                      type: "string" as const,
                      title: PatchTriggerAliasStatus[PatchStatus.Failed],
                      enum: [PatchStatus.Failed],
                    },
                  ],
                },
                taskSpecifiers: {
                  type: "array" as const,
                  minItems: 1,
                  items: {
                    type: "object" as const,
                    title: "Variant/Task Pair",
                    properties: {
                      specifier: {
                        type: "string" as const,
                        title: "Specify Via",
                        default: TaskSpecifier.PatchAlias,
                        oneOf: [
                          {
                            type: "string" as const,
                            title: "Patch Alias",
                            enum: [TaskSpecifier.PatchAlias],
                          },
                          {
                            type: "string" as const,
                            title: "Variant/Task",
                            enum: [TaskSpecifier.VariantTask],
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
                                enum: [TaskSpecifier.PatchAlias],
                              },
                              patchAlias: {
                                type: "string" as const,
                                title: "Patch Alias",
                                default: "",
                                minLength: 1,
                              },
                            },
                          },
                          {
                            properties: {
                              specifier: {
                                enum: [TaskSpecifier.VariantTask],
                              },
                              variantRegex: variant.schema,
                              taskRegex: task.schema,
                            },
                          },
                        ],
                      },
                    },
                  },
                },
                isGithubPRTriggerAlias: {
                  type: "boolean" as const,
                  title: "Schedule in GitHub Pull Requests",
                },
                isGithubMQTriggerAlias: {
                  type: "boolean" as const,
                  title: "Schedule in GitHub Merge Queue",
                },
              },
            },
          },
        ),
      },
    },
  },
  uiSchema: {
    patchAliases: {
      aliasesOverride: {
        "ui:widget":
          projectType === ProjectType.AttachedProject
            ? widgets.RadioBoxWidget
            : "hidden",
        "ui:showLabel": false,
        "ui:data-cy": "patch-aliases-override-radio-box",
      },
      "ui:description": PatchAliasesDescription,
      aliases: patchAliasArray.uiSchema,
      repoData: {
        aliases: patchAliasArray.repoData.uiSchema,
      },
    },
    patchTriggerAliases: {
      aliasesOverride: {
        "ui:widget":
          projectType === ProjectType.AttachedProject
            ? widgets.RadioBoxWidget
            : "hidden",
        "ui:showLabel": false,
        "ui:data-cy": "patch-trigger-aliases-override-radio-box",
      },
      aliases: aliasesUiSchema,
      repoData: {
        aliases: {
          ...aliasesUiSchema,
          "ui:readonly": true,
        },
      },
    },
  },
});

const aliasesUiSchema = {
  "ui:addButtonText": "Add Patch Trigger Alias",
  "ui:orderable": false,
  "ui:showLabel": false,
  "ui:useExpandableCard": true,
  items: {
    "ui:displayTitle": "New Patch Trigger Alias",
    "ui:label": false,
    alias: {
      "ui:data-cy": "pta-alias-input",
    },
    childProjectIdentifier: {
      "ui:data-cy": "project-input",
    },
    parentAsModule: {
      "ui:optional": true,
      "ui:data-cy": "module-input",
      "ui:description":
        "If you want tests to include the parent project's changes, add the parent project as a module.",
    },
    status: {
      "ui:allowDeselect": false,
    },
    taskSpecifiers: {
      "ui:addButtonText": "Add Task Regex Pair",
      "ui:orderable": false,
      "ui:showLabel": false,
      "ui:topAlignDelete": true,
      items: {
        "ui:ObjectFieldTemplate": AccordionFieldTemplate,
        "ui:defaultOpen": true,
        specifier: {
          "ui:widget": widgets.SegmentedControlWidget,
          "ui:aria-controls": ["patchAlias", "taskRegex", "variantRegex"],
        },
        patchAlias: {
          "ui:data-cy": "patch-alias-input",
        },
        taskRegex: {
          "ui:data-cy": "task-regex-input",
        },
        variantRegex: {
          "ui:data-cy": "variant-regex-input",
        },
      },
    },
    isGithubPRTriggerAlias: {
      "ui:border": "top",
      "ui:data-cy": "github-pr-trigger-alias-checkbox",
      "ui:elementWrapperCSS": css`
        margin-bottom: ${size.xs};
      `,
    },
    isGithubMQTriggerAlias: {
      "ui:data-cy": "github-mq-trigger-alias-checkbox",
      "ui:elementWrapperCSS": css`
        margin-bottom: 0;
      `,
    },
  },
};

const PatchAliasesDescription = (
  <>
    Specify aliases to use with the CLI. Aliases may be specified multiple
    times. The result will be their union. All regular expressions must be valid
    Golang regular expressions. Use an alias with the --alias flag passed to the
    CLI patch command. These aliases{" "}
    <StyledLink href={patchAliasesDocumentationUrl}>may be defined</StyledLink>{" "}
    in this project&rsquo;s config YAML instead. The active set of patch aliases
    for the project will be the merged result of aliases defined on this page
    and in the config YAML, with this page taking precedence in the case of
    duplicate names.
  </>
);
