import { StyledLink } from "@evg-ui/lib/components/styles";
import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import { gitTagAliasesDocumentationUrl } from "constants/externalResources";
import {
  alias,
  fieldDisabled,
  form,
  hideIf,
  ProjectType,
  sectionHasError,
} from "../utils";
import { GitTagsFormState } from "./types";

const { gitTagArray } = alias;
const { overrideRadioBox, radioBoxOptions } = form;

export const getFormSchema = (
  projectType: ProjectType,
  githubWebhooksEnabled: boolean,
  formData: GitTagsFormState,
  versionControlEnabled: boolean,
  repoData?: GitTagsFormState,
): ReturnType<GetFormSchema> => {
  const overrideStyling = {
    "ui:widget":
      projectType === ProjectType.AttachedProject
        ? widgets.RadioBoxWidget
        : "hidden",
    "ui:showLabel": false,
  };
  const errorStyling = sectionHasError(versionControlEnabled, projectType);

  return {
    fields: {},
    schema: {
      type: "object" as const,
      properties: {
        github: {
          type: "object" as const,
          title: "",
          properties: {
            githubWebhooksEnabled: {
              type: "null",
              title: "GitHub Webhooks",
              description: `GitHub webhooks ${
                githubWebhooksEnabled ? "are" : "are not"
              } enabled.`,
            },
            gitTagVersionsTitle: {
              type: "null",
              title: "Trigger Versions With Git Tags",
              description: `If an authorized user pushes a tag that matches a specific regex, then a version will be created from this alias. Note that project admins are not authorized by default; they must explicitly be given this permission. ${
                projectType === ProjectType.Repo
                  ? "This setting will not be applied to untracked branches."
                  : ""
              }`,
            },
            gitTagVersionsEnabled: {
              type: ["boolean", "null"],
              oneOf: radioBoxOptions(
                ["Enabled", "Disabled"],
                repoData?.github?.gitTagVersionsEnabled ?? undefined,
              ),
            },
            users: {
              title: "Authorized Users",
              description:
                "This must be a list of authorized GitHub user or bot names. This authorization can alternatively be provisioned on this project's MANA resource.",
              ...overrideRadioBox(
                "gitTagAuthorizedUsers",
                ["Override Repo Users", "Default to Repo Users"],
                {
                  type: "array" as const,
                  items: {
                    type: "string" as const,
                    title: "Username",
                    default: "",
                    minLength: 1,
                    format: "noStartingOrTrailingWhitespace",
                  },
                },
              ),
            },
            teams: {
              title: "Authorized Teams",
              description:
                "This must be the team slug, i.e. the team name with dashes instead of spaces. For example, the team Evergreen Users would be evergreen-users. This authorization can also be provisioned on this project's MANA resource.",
              ...overrideRadioBox(
                "gitTagAuthorizedTeams",
                ["Override Repo Teams", "Default to Repo Teams"],
                {
                  type: "array" as const,
                  items: {
                    type: "string" as const,
                    title: "Team",
                    default: "",
                    minLength: 1,
                    format: "noStartingOrTrailingWhitespace",
                  },
                },
              ),
            },
            gitTags: {
              title: "Git Tag Version Definitions",
              ...overrideRadioBox(
                "gitTagAliases",
                ["Override Repo Git Tags", "Default to Repo Git Tags"],
                // @ts-expect-error: FIXME. This comment was added by an automated script.
                gitTagArray.schema,
              ),
            },
          },
        },
      },
    },
    uiSchema: {
      github: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        gitTagVersionsTitle: {
          "ui:sectionTitle": true,
        },
        gitTagVersionsEnabled: {
          "ui:data-cy": "git-tag-enabled-radio-box",
          "ui:showLabel": false,
          "ui:widget": widgets.RadioBoxWidget,
        },
        users: userTeamStyling(
          "gitTagAuthorizedUsers",
          "Add User",
          repoData?.github?.users?.gitTagAuthorizedUsers === undefined,
          formData?.github?.gitTagVersionsEnabled,
          repoData?.github?.gitTagVersionsEnabled ?? false,
        ),
        teams: userTeamStyling(
          "gitTagAuthorizedTeams",
          "Add Team",
          repoData?.github?.teams?.gitTagAuthorizedTeams === undefined,
          formData?.github?.gitTagVersionsEnabled,
          repoData?.github?.gitTagVersionsEnabled ?? false,
        ),
        gitTags: {
          ...hideIf(
            fieldDisabled(
              formData?.github?.gitTagVersionsEnabled,
              repoData?.github?.gitTagVersionsEnabled ?? false,
            ),
          ),
          ...errorStyling(
            formData?.github?.gitTagVersionsEnabled ?? false,
            formData?.github?.gitTags?.gitTagAliasesOverride,
            formData?.github?.gitTags?.gitTagAliases,
            repoData?.github?.gitTags?.gitTagAliases ?? [],
            "Git Tag Version Definition",
          ),
          gitTagAliasesOverride: overrideStyling,
          "ui:description": GitTagAliasesDescription,
          gitTagAliases: gitTagArray.uiSchema,
          repoData: {
            gitTagAliases: {
              ...gitTagArray.uiSchema,
              "ui:readonly": true,
              items: {
                ...gitTagArray.uiSchema.items,
                "ui:numberedTitle": "Repo Git Tag",
              },
            },
          },
        },
      },
    },
  };
};

const overrideStyling = (isMissingRepoField: boolean) => ({
  "ui:widget": isMissingRepoField ? "hidden" : widgets.RadioBoxWidget,
  "ui:showLabel": false,
});

const userTeamStyling = (
  fieldName: string,
  addButtonText: string,
  shouldOverride: boolean,
  field: boolean | null,
  repoField: boolean | null,
) => ({
  ...hideIf(fieldDisabled(field, repoField)),
  [`${fieldName}Override`]: {
    ...overrideStyling(shouldOverride),
  },
  [fieldName]: {
    "ui:addButtonText": addButtonText,
    "ui:orderable": false,
    "ui:showLabel": false,
  },
  repoData: {
    [fieldName]: {
      "ui:disabled": true,
      "ui:orderable": false,
      "ui:readonly": true,
      "ui:showLabel": false,
    },
  },
});

const GitTagAliasesDescription = (
  <>
    Either the version will be fully populated from a new file, OR variants and
    tasks can be defined for the default config file using variant and task
    regexes/tags. If multiple regexes match and a config file has been defined
    for one or more of them, the version is ambiguous and no version will be
    created. These aliases{" "}
    <StyledLink href={gitTagAliasesDocumentationUrl}>may be defined</StyledLink>{" "}
    in this project&rsquo;s config YAML instead if Version Control is enabled
    and no aliases are defined on the project or repo page.
  </>
);
