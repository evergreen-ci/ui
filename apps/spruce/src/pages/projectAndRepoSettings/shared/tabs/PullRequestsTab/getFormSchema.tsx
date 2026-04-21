import { Description } from "@leafygreen-ui/typography";
import { StyledLink } from "@evg-ui/lib/components/styles";
import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import { pullRequestAliasesDocumentationUrl } from "constants/externalResources";
import { alias, form, ProjectType, sectionHasError } from "../utils";
import { GithubTriggerAliasField } from "./GithubTriggerAliasField";
import { PullRequestsFormState } from "./types";

const { aliasArray, aliasRowUiSchema } = alias;
const { overrideRadioBox, radioBoxOptions } = form;

const fieldDisabled = (
  field: boolean | null | undefined,
  repoField: boolean | null | undefined,
) => field === false || (field == null && repoField === false);

const hideIf = (shouldHide: boolean) =>
  shouldHide && {
    "ui:widget": "hidden",
  };

export const getFormSchema = (
  projectType: ProjectType,
  githubWebhooksEnabled: boolean,
  formData: PullRequestsFormState,
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
            pullRequestSettingsTitle: {
              type: "null",
              title: "Pull Request Settings",
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
              description:
                "Patches can be run manually by commenting ‘evergreen patch’ on the PR even if automated testing isn't enabled; The ‘--alias’ flag is also available to allow users to overwrite the default PR configuration.",
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
        pullRequestSettingsTitle: {
          "ui:numberedTitle": true,
        },
        prTestingEnabled: {
          "ui:data-cy": "pr-testing-enabled-radio-box",
          "ui:widget": widgets.RadioBoxWidget,
        },
        manualPrTestingEnabled: {
          "ui:data-cy": "manual-pr-testing-enabled-radio-box",
          "ui:widget": widgets.RadioBoxWidget,
        },
        oldestAllowedMergeBase: {
          "ui:description":
            "Specify the oldest commit SHA on your project branch that is allowed to be a merge base for a PR",
          "ui:optional": true,
          ...hideIf(
            fieldDisabled(
              formData?.github?.prTestingEnabled,
              repoData?.github?.prTestingEnabled ?? null,
            ) &&
              fieldDisabled(
                formData?.github?.manualPrTestingEnabled,
                repoData?.github?.manualPrTestingEnabled ?? null,
              ),
          ),
        },
        prTesting: {
          ...hideIf(
            fieldDisabled(
              formData?.github?.prTestingEnabled,
              repoData?.github?.prTestingEnabled ?? null,
            ) &&
              fieldDisabled(
                formData?.github?.manualPrTestingEnabled,
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
          "ui:description": (
            <Description>
              For patches created from GitHub pull requests, Evergreen will
              schedule only the tasks and variants matching the tags/regex
              definitions. All regular expressions must be valid Golang regular
              expressions. These aliases can also be configured in this
              project’s config YAML if Version Control is enabled and no aliases
              are defined on the project or repo page.{" "}
              <StyledLink
                href={pullRequestAliasesDocumentationUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                Learn more
              </StyledLink>
              .
            </Description>
          ),
          githubPrAliasesOverride: overrideStyling,
          githubPrAliases: {
            ...aliasRowUiSchema({
              addButtonText: "Add Patch Definition",
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
          "ui:description": (
            <Description>
              Aliases can be configured to run for pull requests on the{" "}
              <StyledLink
                href={pullRequestAliasesDocumentationUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                Patch Aliases
              </StyledLink>{" "}
              page.
            </Description>
          ),
          items: {
            "ui:field": "githubTriggerAliasField",
            "ui:label": false,
          },
        },
      },
    },
  };
};
