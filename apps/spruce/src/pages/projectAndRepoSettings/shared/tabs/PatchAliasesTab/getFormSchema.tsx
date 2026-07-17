import { css } from "@emotion/react";
import { StyledLink } from "@evg-ui/lib/components/styles";
import { size } from "@evg-ui/lib/constants/tokens";
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
            items: {
              properties: {
                alias: {
                  default: "",
                  format: "noStartingOrTrailingWhitespace",
                  minLength: 1,
                  title: "Alias",
                  type: "string" as const,
                },
                childProjectIdentifier: {
                  default: "",
                  format: "noStartingOrTrailingWhitespace",
                  minLength: 1,
                  title: "Project",
                  type: "string" as const,
                },
                isGithubMQTriggerAlias: {
                  title: "Schedule in GitHub Merge Queue",
                  type: "boolean" as const,
                },
                isGithubPRTriggerAlias: {
                  title: "Schedule in GitHub Pull Requests",
                  type: "boolean" as const,
                },
                parentAsModule: {
                  format: "noStartingOrTrailingWhitespace",
                  title: "Module",
                  type: "string" as const,
                },
                status: {
                  default: "",
                  oneOf: [
                    {
                      enum: [""],
                      title: "Select event…",
                      type: "string" as const,
                    },
                    {
                      enum: ["*"],
                      title: PatchTriggerAliasStatus["*"],
                      type: "string" as const,
                    },
                    {
                      enum: [PatchStatus.Success],
                      title: PatchTriggerAliasStatus[PatchStatus.Success],
                      type: "string" as const,
                    },
                    {
                      enum: [PatchStatus.Failed],
                      title: PatchTriggerAliasStatus[PatchStatus.Failed],
                      type: "string" as const,
                    },
                  ],
                  title: "Wait on",
                  type: "string" as const,
                },
                taskSpecifiers: {
                  items: {
                    dependencies: {
                      specifier: {
                        oneOf: [
                          {
                            properties: {
                              patchAlias: {
                                default: "",
                                minLength: 1,
                                title: "Patch Alias",
                                type: "string" as const,
                              },
                              specifier: {
                                enum: [TaskSpecifier.PatchAlias],
                              },
                            },
                          },
                          {
                            properties: {
                              specifier: {
                                enum: [TaskSpecifier.VariantTask],
                              },
                              taskRegex: task.schema,
                              variantRegex: variant.schema,
                            },
                          },
                        ],
                      },
                    },
                    properties: {
                      specifier: {
                        default: TaskSpecifier.PatchAlias,
                        oneOf: [
                          {
                            enum: [TaskSpecifier.PatchAlias],
                            title: "Patch Alias",
                            type: "string" as const,
                          },
                          {
                            enum: [TaskSpecifier.VariantTask],
                            title: "Variant/Task",
                            type: "string" as const,
                          },
                        ],
                        title: "Specify Via",
                        type: "string" as const,
                      },
                    },
                    title: "Variant/Task Pair",
                    type: "object" as const,
                  },
                  minItems: 1,
                  type: "array" as const,
                },
              },
              type: "object" as const,
            },
            type: "array" as const,
          },
        ),
      },
    },
    type: "object" as const,
  },
  uiSchema: {
    patchAliases: {
      aliases: patchAliasArray.uiSchema,
      aliasesOverride: {
        "ui:data-cy": "patch-aliases-override-radio-box",
        "ui:showLabel": false,
        "ui:widget":
          projectType === ProjectType.AttachedProject
            ? widgets.RadioBoxWidget
            : "hidden",
      },
      repoData: {
        aliases: patchAliasArray.repoData.uiSchema,
      },
      "ui:description": PatchAliasesDescription,
    },
    patchTriggerAliases: {
      aliases: aliasesUiSchema,
      aliasesOverride: {
        "ui:data-cy": "patch-trigger-aliases-override-radio-box",
        "ui:showLabel": false,
        "ui:widget":
          projectType === ProjectType.AttachedProject
            ? widgets.RadioBoxWidget
            : "hidden",
      },
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
  items: {
    alias: {
      "ui:data-cy": "pta-alias-input",
    },
    childProjectIdentifier: {
      "ui:data-cy": "project-input",
    },
    isGithubMQTriggerAlias: {
      "ui:data-cy": "github-mq-trigger-alias-checkbox",
      "ui:elementWrapperCSS": css`
        margin-bottom: 0;
      `,
    },
    isGithubPRTriggerAlias: {
      "ui:border": "top",
      "ui:data-cy": "github-pr-trigger-alias-checkbox",
      "ui:elementWrapperCSS": css`
        margin-bottom: ${size.xs};
      `,
    },
    parentAsModule: {
      "ui:data-cy": "module-input",
      "ui:description":
        "If you want tests to include the parent project's changes, add the parent project as a module.",
      "ui:optional": true,
    },
    status: {
      "ui:allowDeselect": false,
    },
    taskSpecifiers: {
      items: {
        patchAlias: {
          "ui:data-cy": "patch-alias-input",
        },
        specifier: {
          "ui:aria-controls": ["patchAlias", "taskRegex", "variantRegex"],
          "ui:widget": widgets.SegmentedControlWidget,
        },
        taskRegex: {
          "ui:data-cy": "task-regex-input",
        },
        "ui:defaultOpen": true,
        "ui:ObjectFieldTemplate": AccordionFieldTemplate,
        variantRegex: {
          "ui:data-cy": "variant-regex-input",
        },
      },
      "ui:addButtonText": "Add task regex pair",
      "ui:orderable": false,
      "ui:showLabel": false,
      "ui:topAlignDelete": true,
    },
    "ui:displayTitle": "New Patch Trigger Alias",
    "ui:label": false,
  },
  "ui:addButtonText": "Add patch trigger alias",
  "ui:orderable": false,
  "ui:showLabel": false,
  "ui:useExpandableCard": true,
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
