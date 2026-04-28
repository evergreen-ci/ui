import { StyledLink } from "@evg-ui/lib/components/styles";
import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import { pullRequestAliasesDocumentationUrl } from "constants/externalResources";
import { GithubProjectConflicts } from "gql/generated/types";
import {
  fieldDisabled,
  hideIf,
  alias,
  form,
  ProjectType,
  sectionHasError,
  githubConflictErrorStyling,
} from "../utils";
import { GithubTriggerAliasField } from "./GithubTriggerAliasField";
import { PullRequestsFormState } from "./types";

const { aliasArray, aliasRowUiSchema } = alias;
const { overrideRadioBox, radioBoxOptions } = form;

export const getFormSchema = (
  projectType: ProjectType,
  githubWebhooksEnabled: boolean,
  formData: PullRequestsFormState,
  githubProjectConflicts: GithubProjectConflicts | undefined,
  versionControlEnabled: boolean,
  repoData?: PullRequestsFormState,
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
    fields: {
      githubTriggerAliasField: GithubTriggerAliasField,
    },
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
            prTestingEnabledTitle: {
              type: "null",
              title: "GitHub Pull Request Testing",
              ...(projectType === ProjectType.Repo && {
                description:
                  "If enabled, then untracked branches will also use the file patterns defined here for PR testing.",
              }),
            },
            prTestingEnabled: {
              type: ["boolean", "null"],
              title: "Automated Testing",
              oneOf: radioBoxOptions(
                ["Enabled", "Disabled"],
                repoData?.github?.prTestingEnabled ?? undefined,
              ),
            },
            manualPrTestingEnabled: {
              type: ["boolean", "null"],
              title: "Manual Testing",
              oneOf: radioBoxOptions(
                ["Enabled", "Disabled"],
                repoData?.github?.manualPrTestingEnabled ?? undefined,
              ),
            },
            oldestAllowedMergeBase: {
              type: "string" as const,
              title: "Oldest Allowed Merge Base",
            },
            prTesting: {
              type: "object" as const,
              title: "GitHub Patch Definitions",
              ...overrideRadioBox(
                "githubPrAliases",
                [
                  "Override Repo Patch Definition",
                  "Default to Repo Patch Definition",
                ],
                // @ts-expect-error: FIXME. This comment was added by an automated script.
                aliasArray.schema,
              ),
            },
            githubPRTriggerAliases: {
              type: "array" as const,
              title: "Pull Request Trigger Aliases",
              items: {
                type: "object" as const,
              },
            },
          },
        },
      },
    },
    uiSchema: {
      github: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        prTestingEnabledTitle: {
          "ui:sectionTitle": true,
        },
        prTestingEnabled: {
          "ui:data-cy": "pr-testing-enabled-radio-box",
          "ui:widget": widgets.RadioBoxWidget,
          ...githubConflictErrorStyling(
            githubProjectConflicts?.prTestingIdentifiers ?? null,
            formData?.github?.prTestingEnabled ?? null,
            repoData?.github?.prTestingEnabled ?? false,
            "PR Testing",
          ),
        },
        manualPrTestingEnabled: {
          "ui:data-cy": "manual-pr-testing-enabled-radio-box",
          "ui:description":
            "Patches can be run manually by commenting ‘evergreen patch’ on the PR even if automated testing isn't enabled; The ‘--alias’ flag is also available to allow users to overwrite the default PR configuration.",
          "ui:widget": widgets.RadioBoxWidget,
          ...githubConflictErrorStyling(
            githubProjectConflicts?.prTestingIdentifiers ?? null,
            formData?.github?.manualPrTestingEnabled ?? null,
            repoData?.github?.manualPrTestingEnabled ?? false,
            "PR Testing",
          ),
        },
        oldestAllowedMergeBase: {
          "ui:description":
            "Specify the oldest commit SHA on your project branch that is allowed to be a merge base for a PR",
          "ui:optional": true,
          ...hideIf(
            fieldDisabled(
              formData?.github?.prTestingEnabled ?? null,
              repoData?.github?.prTestingEnabled ?? null,
            ) &&
              fieldDisabled(
                formData?.github?.manualPrTestingEnabled ?? null,
                repoData?.github?.manualPrTestingEnabled ?? null,
              ),
          ),
        },
        prTesting: {
          ...hideIf(
            fieldDisabled(
              formData?.github?.prTestingEnabled ?? null,
              repoData?.github?.prTestingEnabled ?? null,
            ) &&
              fieldDisabled(
                formData?.github?.manualPrTestingEnabled ?? null,
                repoData?.github?.manualPrTestingEnabled ?? null,
              ),
          ),
          ...errorStyling(
            // @ts-expect-error: FIXME. This comment was added by an automated script.
            formData?.github?.prTestingEnabled,
            formData?.github?.prTesting?.githubPrAliasesOverride,
            formData?.github?.prTesting?.githubPrAliases,
            repoData?.github?.prTesting?.githubPrAliases ?? [],
            "GitHub Patch Definition",
          ),
          "ui:description": PRAliasesDescription,
          githubPrAliasesOverride: overrideStyling,
          githubPrAliases: {
            ...aliasRowUiSchema({
              addButtonText: "Add patch definition",
              numberedTitle: "Patch Definition",
            }),
          },
          repoData: {
            githubPrAliases: {
              ...aliasRowUiSchema({
                isRepo: true,
                numberedTitle: "Repo Patch Definition",
              }),
            },
          },
        },

        githubPRTriggerAliases: {
          "ui:data-cy": "github-pr-trigger-aliases",
          "ui:addable": false,
          "ui:orderable": false,
          "ui:placeholder":
            "No aliases are scheduled to run for pull requests.",
          "ui:readonly": true,
          "ui:removable": false,
          "ui:description": GithubTriggerAliasDescription,
          items: {
            "ui:field": "githubTriggerAliasField",
            "ui:label": false,
          },
        },
      },
    },
  };
};

const PRAliasesDescription = (
  <>
    For patches created from GitHub pull requests, Evergreen will schedule only
    the tasks and variants matching the tags/regex definitions. All regular
    expressions must be valid Golang regular expressions. These aliases{" "}
    <StyledLink href={pullRequestAliasesDocumentationUrl}>
      may be defined
    </StyledLink>{" "}
    in this project&rsquo;s config YAML instead if Version Control is enabled
    and no aliases are defined on the project or repo page.
  </>
);

const GithubTriggerAliasDescription = (
  <>
    Aliases can be configured to run for pull requests on the{" "}
    <StyledLink
      href={pullRequestAliasesDocumentationUrl}
      rel="noopener noreferrer"
      target="_blank"
    >
      Patch Aliases
    </StyledLink>{" "}
    page.
  </>
);
