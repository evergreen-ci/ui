import { StyledLink } from "@evg-ui/lib/components/styles";
import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import { githubChecksAliasesDocumentationUrl } from "constants/externalResources";
import { GithubProjectConflicts } from "gql/generated/types";
import {
  alias,
  form,
  ProjectType,
  githubConflictErrorStyling,
  sectionHasError,
} from "../utils";
import { CommitChecksFormState } from "./types";

const { aliasArray, aliasRowUiSchema } = alias;
const { overrideRadioBox, radioBoxOptions } = form;

export const getFormSchema = (
  projectType: ProjectType,
  githubWebhooksEnabled: boolean,
  formData: CommitChecksFormState,
  githubProjectConflicts: GithubProjectConflicts | undefined,
  versionControlEnabled: boolean,
  repoData?: CommitChecksFormState,
): ReturnType<GetFormSchema> => {
  const errorStyling = sectionHasError(versionControlEnabled, projectType);

  return {
    fields: {},
    schema: {
      type: "object" as const,
      properties: {
        github: {
          type: "object" as const,
          title: "GitHub",
          properties: {
            githubWebhooksEnabled: {
              type: "null",
              title: "GitHub Webhooks",
              description: `GitHub webhooks ${
                githubWebhooksEnabled ? "are" : "are not"
              } enabled.`,
            },
            githubChecksEnabledTitle: {
              type: "null",
              title: "GitHub Commit Checks",
            },
            githubChecksEnabled: {
              type: ["boolean", "null"],
              oneOf: radioBoxOptions(
                ["Enabled", "Disabled"],
                repoData?.github?.githubChecksEnabled ?? undefined,
              ),
            },
            githubChecks: {
              title: "Commit Check Definitions",
              ...overrideRadioBox(
                "githubCheckAliases",
                ["Override Repo Definition", "Default to Repo Definition"],
                // @ts-expect-error: FIXME. This comment was added by an automated script.
                aliasArray.schema,
              ),
            },
          },
        },
      },
    },
    uiSchema: {
      github: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,

        githubChecksEnabledTitle: {
          "ui:sectionTitle": true,
          "ui:description": GitHubChecksAliasesDescription(projectType),
        },

        githubChecksEnabled: {
          "ui:data-cy": "github-checks-enabled-radio-box",
          "ui:showLabel": false,
          "ui:widget": widgets.RadioBoxWidget,
          ...githubConflictErrorStyling(
            githubProjectConflicts?.commitCheckIdentifiers ?? null,
            formData?.github?.githubChecksEnabled ?? null,
            repoData?.github?.githubChecksEnabled ?? false,
            "Commit Checks",
          ),
        },

        githubChecks: {
          ...errorStyling(
            formData?.github?.githubChecksEnabled ?? false,
            formData?.github?.githubChecks?.githubCheckAliasesOverride ?? false,
            formData?.github?.githubChecks?.githubCheckAliases ?? [],
            repoData?.github?.githubChecks?.githubCheckAliases ?? [],
            "Commit Check Definition",
          ),
          githubCheckAliasesOverride: {
            "ui:widget":
              projectType === ProjectType.AttachedProject
                ? widgets.RadioBoxWidget
                : "hidden",
            "ui:showLabel": false,
          },
          githubCheckAliases: aliasRowUiSchema({
            addButtonText: "Add Definition",
            numberedTitle: "Commit Check Definition",
          }),
          repoData: {
            githubCheckAliases: aliasRowUiSchema({
              isRepo: true,
              numberedTitle: "Repo Commit Check Definition",
            }),
          },
        },
      },
    },
  };
};

const GitHubChecksAliasesDescription = (projectType: ProjectType) => (
  <>
    Commits will send their status as a GitHub Check (the check will pass/fail
    based only on the tasks matching the tags/regexes definitions). These
    aliases{" "}
    <StyledLink href={githubChecksAliasesDocumentationUrl}>
      may be defined
    </StyledLink>{" "}
    in this project&rsquo;s config YAML instead if Version Control is enabled
    and no aliases are defined on the project or repo page.
    {projectType === ProjectType.Repo &&
      " If enabled, these settings can only apply to one branch project that also has this feature enabled. They do not apply to untracked branches."}
  </>
);
