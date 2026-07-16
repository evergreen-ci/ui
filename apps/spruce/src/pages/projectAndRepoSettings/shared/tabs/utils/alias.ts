import { css } from "@emotion/react";
import {
  AccordionFieldTemplate,
  FieldRow,
} from "components/SpruceForm/FieldTemplates";
import { STANDARD_FIELD_WIDTH } from "components/SpruceForm/utils";
import widgets from "components/SpruceForm/Widgets";
import { ProjectAlias, ProjectAliasInput } from "gql/generated/types";

const textAreaCSS = css`
  box-sizing: border-box;
  max-width: ${STANDARD_FIELD_WIDTH}px;
`;

export enum AliasNames {
  MergeQueue = "__commit_queue",
  GithubPr = "__github",
  GithubCheck = "__github_checks",
  GitTag = "__git_tag",
}

export enum GitTagSpecifier {
  ConfigFile = "CONFIG_FILE",
  VariantTask = "VARIANT_TASK",
}

export enum VariantTaskSpecifier {
  Regex = "REGEX",
  Tags = "TAGS",
}

export type AliasFormType = {
  id: string;
  alias: string;
  description: string;
  displayTitle?: string;
  specifier?: GitTagSpecifier;
  gitTag: string;
  remotePath: string;
  variants: {
    specifier: VariantTaskSpecifier;
    variant: string;
    variantTags: string[];
  };
  tasks: {
    specifier: VariantTaskSpecifier;
    task: string;
    taskTags: string[];
  };
  parameters: {
    key: string;
    value: string;
  }[];
};

const aliasToForm = ({
  alias,
  description,
  gitTag,
  id,
  parameters,
  remotePath,
  task,
  taskTags,
  variant,
  variantTags,
}: ProjectAlias): AliasFormType => ({
  alias,
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  description,
  gitTag,
  id,
  remotePath,
  tasks: {
    specifier: task ? VariantTaskSpecifier.Regex : VariantTaskSpecifier.Tags,
    task,
    taskTags,
  },
  variants: {
    specifier: variant ? VariantTaskSpecifier.Regex : VariantTaskSpecifier.Tags,
    variant,
    variantTags,
  },
  ...(alias === AliasNames.GitTag && {
    specifier: remotePath
      ? GitTagSpecifier.ConfigFile
      : GitTagSpecifier.VariantTask,
  }),
  ...(!Object.values(AliasNames).includes(alias as AliasNames) && {
    displayTitle: alias,
  }),
  parameters,
});

// Bucket aliases according to their "alias" field
export const sortAliases = (
  aliases: ProjectAlias[],
): Record<string, AliasFormType[]> =>
  aliases.reduce(
    (o, a) => {
      const transformedAlias = aliasToForm(a);
      if (a.alias === AliasNames.GithubPr) {
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        o.githubPrAliases.push(transformedAlias);
      } else if (a.alias === AliasNames.GithubCheck) {
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        o.githubCheckAliases.push(transformedAlias);
      } else if (a.alias === AliasNames.GitTag) {
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        o.gitTagAliases.push(transformedAlias);
      } else if (a.alias === AliasNames.MergeQueue) {
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        o.mergeQueueAliases.push(transformedAlias);
      } else {
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        o.patchAliases.push(transformedAlias);
      }
      return o;
    },
    {
      githubCheckAliases: [],
      githubPrAliases: [],
      gitTagAliases: [],
      mergeQueueAliases: [],
      patchAliases: [],
    },
  );

const transformVariants = ({
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  specifier,
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  variant,
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  variantTags,
}): {
  variant: string;
  variantTags: string[];
} =>
  specifier === VariantTaskSpecifier.Regex
    ? {
        variant,
        variantTags: [],
      }
    : {
        variant: "",
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        variantTags: variantTags?.filter((tag) => tag) ?? [],
      };

const transformTasks = ({
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  specifier,
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  task,
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  taskTags,
}): {
  task: string;
  taskTags: string[];
} =>
  specifier === VariantTaskSpecifier.Regex
    ? {
        task,
        taskTags: [],
      }
    : {
        task: "",
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        taskTags: taskTags?.filter((tag) => tag) ?? [],
      };

/**
 * `transformAliases` transforms alias form data into the format expected by GQL.
 * @param aliases - alias form data
 * @param override - whether to override existing aliases
 * @param aliasName - alias name to override
 * @returns - transformed alias form data
 */
export const transformAliases = (
  aliases: AliasFormType[],
  override: boolean,
  aliasName?: AliasNames,
): ProjectAliasInput[] =>
  override
    ? aliases.map((a) => {
        const {
          alias,
          description,
          gitTag,
          id,
          parameters,
          remotePath,
          specifier,
          tasks,
          variants,
        } = a;
        if (aliasName === AliasNames.GitTag) {
          return specifier === GitTagSpecifier.ConfigFile
            ? {
                alias: aliasName,
                description: "",
                gitTag,
                id: id || "",
                parameters,
                remotePath,
                task: "",
                taskTags: [],
                variant: "",
                variantTags: [],
              }
            : {
                ...(tasks && transformTasks(tasks)),
                ...(variants && transformVariants(variants)),
                alias: aliasName,
                description: "",
                gitTag,
                id: id || "",
                parameters,
                remotePath: "",
              };
        }
        return {
          ...(tasks && transformTasks(tasks)),
          ...(variants && transformVariants(variants)),
          alias: alias || aliasName || "",
          description: description || "",
          gitTag: "",
          id: id || "",
          parameters,
          remotePath: "",
        };
      })
    : [];

export const baseProps = {
  alias: {
    schema: {
      default: "",
      minLength: 1,
      title: "Alias Name",
      type: "string" as const,
    },
    uiSchema: {
      "ui:data-cy": "alias-input",
    },
  },
  description: {
    schema: {
      default: "",
      title: "Description",
      type: "string" as const,
    },
    uiSchema: {
      "ui:elementWrapperCSS": textAreaCSS,
      "ui:widget": "textarea",
    },
  },
  gitTag: {
    schema: {
      default: "",
      minLength: 1,
      title: "Git Tag Regex",
      type: "string" as const,
    },
    uiSchema: {
      "ui:data-cy": "git-tag-input",
    },
  },
  remotePath: {
    schema: {
      default: "",
      minLength: 1,
      title: "Config File",
      type: "string" as const,
    },
    uiSchema: {
      "ui:data-cy": "remote-path-input",
      "ui:sectionId": "remote-path-field",
    },
  },
  task: {
    schema: {
      default: "",
      minLength: 1,
      title: "Task Regex",
      type: "string" as const,
    },
    uiSchema: {
      "ui:ariaLabelledBy": "task-input-control",
      "ui:data-cy": "task-input",
      "ui:elementWrapperCSS": textAreaCSS,
      "ui:placeholder": "Golang Regex",
      "ui:sectionId": "task-regex-field",
      "ui:widget": "textarea",
    },
  },
  taskTags: {
    schema: {
      items: {
        default: "",
        minLength: 1,
        title: "Task Tag",
        type: "string" as const,
      },
      minItems: 1,
      type: "array" as const,
    },
    uiSchema: {
      items: {
        "ui:ariaLabelledBy": "variant-input-control",
        "ui:data-cy": "task-tags-input",
      },
      "ui:addButtonSize": "xsmall",
      "ui:addButtonText": "Add task tag",
      "ui:orderable": false,
      "ui:sectionId": "task-tags-field",
      "ui:showLabel": false,
      "ui:topAlignDelete": true,
    },
  },
  variant: {
    schema: {
      default: "",
      minLength: 1,
      title: "Variant Regex",
      type: "string" as const,
    },
    uiSchema: {
      "ui:ariaLabelledBy": "variant-input-control",
      "ui:data-cy": "variant-input",
      "ui:elementWrapperCSS": textAreaCSS,
      "ui:placeholder": "Golang Regex",
      "ui:sectionId": "variant-regex-field",
      "ui:widget": "textarea",
    },
  },
  variantTags: {
    schema: {
      items: {
        default: "",
        minLength: 1,
        title: "Variant Tag",
        type: "string" as const,
      },
      minItems: 1,
      title: "Variant Tags",
      type: "array" as const,
    },
    uiSchema: {
      items: {
        "ui:ariaLabelledBy": "variant-input-control",
        "ui:data-cy": "variant-tags-input",
      },
      "ui:addButtonSize": "xsmall",
      "ui:addButtonText": "Add variant tag",
      "ui:orderable": false,
      "ui:sectionId": "variant-tags-field",
      "ui:showLabel": false,
      "ui:topAlignDelete": true,
    },
  },
};

const {
  alias,
  description,
  gitTag,
  remotePath,
  task,
  taskTags,
  variant,
  variantTags,
} = baseProps;

const variants = {
  schema: {
    dependencies: {
      specifier: {
        oneOf: [
          {
            properties: {
              specifier: {
                enum: [VariantTaskSpecifier.Tags],
              },
              variantTags: variantTags.schema,
            },
          },
          {
            properties: {
              specifier: {
                enum: [VariantTaskSpecifier.Regex],
              },
              variant: variant.schema,
            },
          },
        ],
      },
    },
    properties: {
      specifier: {
        default: VariantTaskSpecifier.Tags,
        oneOf: [
          {
            enum: [VariantTaskSpecifier.Tags],
            title: "Variant Tags",
            type: "string" as const,
          },
          {
            enum: [VariantTaskSpecifier.Regex],
            title: "Variant Regex",
            type: "string" as const,
          },
        ],
        title: "",
        type: "string" as const,
      },
    },
    title: "",
    type: "object" as const,
  },
  uiSchema: {
    specifier: {
      "ui:aria-controls": ["variant-regex-field", "variant-tags-field"],
      "ui:data-cy": "variant-input-control",
      "ui:sectionId": "variant-task-field",
      "ui:widget": widgets.SegmentedControlWidget,
    },
    variant: variant.uiSchema,
    variantTags: variantTags.uiSchema,
  },
};

const tasks = {
  schema: {
    dependencies: {
      specifier: {
        oneOf: [
          {
            properties: {
              specifier: {
                enum: [VariantTaskSpecifier.Tags],
              },
              taskTags: taskTags.schema,
            },
          },
          {
            properties: {
              specifier: {
                enum: [VariantTaskSpecifier.Regex],
              },
              task: task.schema,
            },
          },
        ],
      },
    },
    properties: {
      specifier: {
        default: VariantTaskSpecifier.Tags,
        oneOf: [
          {
            enum: [VariantTaskSpecifier.Tags],
            title: "Task Tags",
            type: "string" as const,
          },
          {
            enum: [VariantTaskSpecifier.Regex],
            title: "Task Regex",
            type: "string" as const,
          },
        ],
        title: "",
        type: "string" as const,
      },
    },
    title: "",
    type: "object" as const,
  },
  uiSchema: {
    specifier: {
      "ui:aria-controls": ["task-regex-field", "task-tags-field"],
      "ui:data-cy": "task-input-control",
      "ui:widget": widgets.SegmentedControlWidget,
    },
    task: task.uiSchema,
    taskTags: taskTags.uiSchema,
  },
};

const parameters = {
  schema: {
    items: {
      properties: {
        key: {
          title: "Key",
          type: "string" as const,
        },
        value: {
          title: "Value",
          type: "string" as const,
        },
      },
      required: ["key", "value"],
      title: "Parameter",
      type: "object" as const,
    },
    title: "Parameters",
    type: "array" as const,
  },
  uiSchema: {
    items: {
      key: {
        "ui:placeholder": "Key",
      },
      "ui:data-cy": "parameter-input",
      "ui:ObjectFieldTemplate": FieldRow,
      value: {
        "ui:placeholder": "Value",
      },
    },
    "ui:addButtonText": "Add parameter",
  },
};

export const gitTagArray = {
  schema: {
    items: {
      dependencies: {
        specifier: {
          oneOf: [
            {
              properties: {
                remotePath: remotePath.schema,
                specifier: {
                  enum: [GitTagSpecifier.ConfigFile],
                },
              },
            },
            {
              properties: {
                specifier: {
                  enum: [GitTagSpecifier.VariantTask],
                },
                tasks: tasks.schema,
                variants: variants.schema,
              },
            },
          ],
        },
      },
      properties: {
        gitTag: gitTag.schema,
        specifier: {
          default: GitTagSpecifier.ConfigFile,
          oneOf: [
            {
              enum: [GitTagSpecifier.ConfigFile],
              title: "Config File",
              type: "string" as const,
            },
            {
              enum: [GitTagSpecifier.VariantTask],
              title: "Variant/Task",
              type: "string" as const,
            },
          ],
          title: "Specify Via",
          type: "string" as const,
        },
      },
      type: "object" as const,
    },
    type: "array" as const,
  },
  uiSchema: {
    items: {
      gitTag: gitTag.uiSchema,
      remotePath: remotePath.uiSchema,
      specifier: {
        "ui:aria-controls": ["variant-task-field", "remote-path-field"],
        "ui:widget": widgets.SegmentedControlWidget,
      },
      tasks: tasks.uiSchema,
      "ui:numberedTitle": "Git Tag",
      "ui:ObjectFieldTemplate": AccordionFieldTemplate,
      variants: variants.uiSchema,
    },
    "ui:addButtonText": "Add git tag",
    "ui:orderable": false,
    "ui:showLabel": false,
    "ui:topAlignDelete": true,
  },
};

export const aliasArray = {
  schema: {
    items: {
      properties: {
        tasks: tasks.schema,
        variants: variants.schema,
      },
      type: "object" as const,
    },
    type: "array" as const,
  },
  uiSchema: {
    "ui:orderable": false,
  },
};

type AliasRowUIParams = {
  addButtonText?: string;
  aliasHidden?: boolean;
  displayTitle?: string;
  numberedTitle?: string;
  isRepo?: boolean;
  useExpandableCard?: boolean;
};

export const aliasRowUiSchema = ({
  addButtonText,
  aliasHidden = true,
  displayTitle,
  isRepo = false,
  numberedTitle,
  useExpandableCard = false,
}: AliasRowUIParams) => ({
  "ui:orderable": false,
  "ui:showLabel": false,
  "ui:topAlignDelete": true,
  "ui:useExpandableCard": useExpandableCard,
  ...(addButtonText && { "ui:addButtonText": addButtonText }),
  ...(isRepo && { "ui:readonly": true }),
  items: {
    ...(!useExpandableCard && {
      "ui:ObjectFieldTemplate": AccordionFieldTemplate,
    }),
    ...(displayTitle && { "ui:displayTitle": displayTitle }),
    ...(numberedTitle && { "ui:numberedTitle": numberedTitle }),
    "ui:useExpandableCard": useExpandableCard,
    ...(!aliasHidden && {
      alias: alias.uiSchema,
      description: description.uiSchema,
    }),
    parameters: parameters.uiSchema,
    tasks: tasks.uiSchema,
    variants: variants.uiSchema,
  },
});

export const patchAliasArray = {
  repoData: {
    uiSchema: aliasRowUiSchema({
      aliasHidden: false,
      displayTitle: "New Patch Alias",
      isRepo: true,
      useExpandableCard: true,
    }),
  },
  schema: {
    items: {
      properties: {
        alias: alias.schema,
        description: description.schema,
        parameters: parameters.schema,
        tasks: tasks.schema,
        variants: variants.schema,
      },
      type: "object" as const,
    },
    type: "array" as const,
  },
  uiSchema: aliasRowUiSchema({
    addButtonText: "Add patch alias",
    aliasHidden: false,
    displayTitle: "New Patch Alias",
    useExpandableCard: true,
  }),
};
