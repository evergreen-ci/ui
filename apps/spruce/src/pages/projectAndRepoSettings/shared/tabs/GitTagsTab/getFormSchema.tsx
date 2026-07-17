import { StyledLink } from "@evg-ui/lib/components/styles";
import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import { gitTagAliasesDocumentationUrl } from "constants/externalResources";
import {
  ProjectType,
  alias,
  fieldDisabled,
  form,
  hideIf,
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
    "ui:showLabel": false,
    "ui:widget":
      projectType === ProjectType.AttachedProject
        ? widgets.RadioBoxWidget
        : "hidden",
  };
  const errorStyling = sectionHasError(versionControlEnabled, projectType);

  return {
    fields: {},
    schema: {
      properties: {
        github: {
          properties: {
            githubWebhooksEnabled: {
              description: `GitHub webhooks ${
                githubWebhooksEnabled ? "are" : "are not"
              } enabled.`,
              title: "GitHub Webhooks",
              type: "null",
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
            gitTagVersionsEnabled: {
              oneOf: radioBoxOptions(
                ["Enabled", "Disabled"],
                repoData?.github?.gitTagVersionsEnabled ?? undefined,
              ),
              type: ["boolean", "null"],
            },
            gitTagVersionsTitle: {
              description: `If an authorized user pushes a tag that matches a specific regex, then a version will be created from this alias. Note that project admins are not authorized by default; they must explicitly be given this permission. ${
                projectType === ProjectType.Repo
                  ? "This setting will not be applied to untracked branches."
                  : ""
              }`,
              title: "Trigger Versions With Git Tags",
              type: "null",
            },
            teams: {
              description:
                "This must be the team slug, i.e. the team name with dashes instead of spaces. For example, the team Evergreen Users would be evergreen-users. This authorization can also be provisioned on this project's MANA resource.",
              title: "Authorized Teams",
              ...overrideRadioBox(
                "gitTagAuthorizedTeams",
                ["Override Repo Teams", "Default to Repo Teams"],
                {
                  items: {
                    default: "",
                    format: "noStartingOrTrailingWhitespace",
                    minLength: 1,
                    title: "Team",
                    type: "string" as const,
                  },
                  type: "array" as const,
                },
              ),
            },
            users: {
              description:
                "This must be a list of authorized GitHub user or bot names. This authorization can alternatively be provisioned on this project's MANA resource.",
              title: "Authorized Users",
              ...overrideRadioBox(
                "gitTagAuthorizedUsers",
                ["Override Repo Users", "Default to Repo Users"],
                {
                  items: {
                    default: "",
                    format: "noStartingOrTrailingWhitespace",
                    minLength: 1,
                    title: "Username",
                    type: "string" as const,
                  },
                  type: "array" as const,
                },
              ),
            },
          },
          title: "",
          type: "object" as const,
        },
      },
      type: "object" as const,
    },
    uiSchema: {
      github: {
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
          gitTagAliases: gitTagArray.uiSchema,
          gitTagAliasesOverride: overrideStyling,
          repoData: {
            gitTagAliases: {
              ...gitTagArray.uiSchema,
              items: {
                ...gitTagArray.uiSchema.items,
                "ui:numberedTitle": "Repo Git Tag",
              },
              "ui:readonly": true,
            },
          },
          "ui:description": GitTagAliasesDescription,
        },
        gitTagVersionsEnabled: {
          "ui:data-cy": "git-tag-enabled-radio-box",
          "ui:showLabel": false,
          "ui:widget": widgets.RadioBoxWidget,
        },
        gitTagVersionsTitle: {
          "ui:sectionTitle": true,
        },
        teams: userTeamStyling(
          "gitTagAuthorizedTeams",
          "Add Team",
          repoData?.github?.teams?.gitTagAuthorizedTeams === undefined,
          formData?.github?.gitTagVersionsEnabled,
          repoData?.github?.gitTagVersionsEnabled ?? false,
        ),
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        users: userTeamStyling(
          "gitTagAuthorizedUsers",
          "Add User",
          repoData?.github?.users?.gitTagAuthorizedUsers === undefined,
          formData?.github?.gitTagVersionsEnabled,
          repoData?.github?.gitTagVersionsEnabled ?? false,
        ),
      },
    },
  };
};

const overrideStyling = (isMissingRepoField: boolean) => ({
  "ui:showLabel": false,
  "ui:widget": isMissingRepoField ? "hidden" : widgets.RadioBoxWidget,
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
