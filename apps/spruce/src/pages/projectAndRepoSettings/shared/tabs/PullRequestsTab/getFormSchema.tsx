import { Description } from "@leafygreen-ui/typography";
import { StyledLink } from "@evg-ui/lib/components/styles";
import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import { pullRequestAliasesDocumentationUrl } from "constants/externalResources";
import { alias, form, ProjectType } from "../utils";
import { GithubTriggerAliasField } from "./GithubTriggerAliasField";
import { PullRequestsFormState } from "./types";

const { aliasArray, aliasRowUiSchema } = alias;
const { overrideRadioBox, radioBoxOptions } = form;

export const getFormSchema = (
  projectType: ProjectType,
  githubWebhooksEnabled: boolean,
  _formData: PullRequestsFormState,
  repoData?: PullRequestsFormState,
): ReturnType<GetFormSchema> => ({
  fields: {
    githubTriggerAliasField: GithubTriggerAliasField,
  },
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
              // schema, not data
              // @ts-expect-error: aliasArray.schema is a valid JSON schema but too complex for the JSONSchema7 type
              aliasArray.schema,
            ),
            properties: {
              // @ts-expect-error: aliasArray.schema is a valid JSON schema but too complex for the JSONSchema7 type
              githubPrAliases: aliasArray.schema,
            },
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
      },
      manualPrTestingEnabled: {
        "ui:data-cy": "manual-pr-testing-enabled-radio-box",
        "ui:widget": widgets.RadioBoxWidget,
      },
      oldestAllowedMergeBase: {
        "ui:description":
          "Specify the oldest commit SHA on your project branch that is allowed to be a merge base for a PR",
        "ui:optional": true,
      },
      prTesting: {
        "ui:description": (
          <Description>
            For patches created from GitHub pull requests, Evergreen will
            schedule only the tasks and variants matching the tags/regex
            definitions. All regular expressions must be valid Golang regular
            expressions. These aliases can also be configured in this project’s
            config YAML if Version Control is enabled and no aliases are defined
            on the project or repo page.{" "}
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
        githubPrAliases: {
          "ui:options": {
            orderable: true,
          },
          items: aliasRowUiSchema,
        },
      },
      githubPRTriggerAliases: {
        "ui:field": "githubTriggerAliasField",
      },
    },
  },
});
