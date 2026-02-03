import { Description } from "@leafygreen-ui/typography";
import { StyledRouterLink, StyledLink } from "@evg-ui/lib/components";
import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import {
  mergeQueueAliasesDocumentationUrl,
  pullRequestAliasesDocumentationUrl,
  gitTagAliasesDocumentationUrl,
  githubChecksAliasesDocumentationUrl,
} from "constants/externalResources";
import {
  getProjectSettingsRoute,
  getRepoSettingsRoute,
  ProjectSettingsTabRoutes,
} from "constants/routes";
import { GithubProjectConflicts } from "gql/generated/types";
import { getTabTitle } from "../../getTabTitle";
import { alias, form, ProjectType } from "../utils";
import { githubConflictErrorStyling, sectionHasError } from "./getErrors";
import { GithubTriggerAliasField } from "./GithubTriggerAliasField";
import { GCQFormState } from "./types";

const { aliasArray, aliasRowUiSchema, gitTagArray } = alias;
const { overrideRadioBox, placeholderIf, radioBoxOptions } = form;

export const getFormSchema = (
  identifier: string,
  projectType: ProjectType,
  githubWebhooksEnabled: boolean,
  formData: GCQFormState,
  githubProjectConflicts: GithubProjectConflicts,
  versionControlEnabled: boolean,
  repoData?: GCQFormState,
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
                // @ts-expect-error: FIXME. This comment was added by an automated script.
                repoData?.github?.prTestingEnabled,
              ),
            },
            manualPrTestingEnabled: {
              type: ["boolean", "null"],
              title: "Manual Testing",
              oneOf: radioBoxOptions(
                ["Enabled", "Disabled"],
                // @ts-expect-error: FIXME. This comment was added by an automated script.
                repoData?.github?.manualPrTestingEnabled,
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
            githubChecksEnabledTitle: {
              type: "null",
              title: "GitHub Commit Checks",
            },
            githubChecksEnabled: {
              type: ["boolean", "null"],
              oneOf: radioBoxOptions(
                ["Enabled", "Disabled"],
                repoData?.github?.githubChecksEnabled,
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
            gitTagVersionsTitle: {
              type: "null",
              title: "Trigger Versions With Git Tags",
              description: `If an authorized user pushes a tag that matches a specific regex, then a version will be created from this alias. 
                Note that project admins are not authorized by default; they must explicitly be given this permission. 
                ${projectType === ProjectType.Repo ? "This setting will not be applied to untracked branches." : ""}`,
            },
            gitTagVersionsEnabled: {
              type: ["boolean", "null"],
              oneOf: radioBoxOptions(
                ["Enabled", "Disabled"],
                // @ts-expect-error: FIXME. This comment was added by an automated script.
                repoData?.github?.gitTagVersionsEnabled,
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
        mergeQueue: {
          type: "object" as const,
          title: "Merge Queue",
          ...(projectType === ProjectType.Repo && {
            description:
              "If enabled, these settings can only apply to one branch project that also has this feature enabled. They do not apply to untracked branches.",
          }),
          properties: {
            enabled: {
              type: ["boolean", "null"],
              oneOf: radioBoxOptions(
                ["Enabled", "Disabled"],
                // @ts-expect-error: FIXME. This comment was added by an automated script.
                repoData?.mergeQueue?.enabled,
              ),
            },
            patchDefinitions: {
              type: "object" as const,
              title: "Merge Queue Patch Definitions",
              ...overrideRadioBox(
                "mergeQueueAliases",
                [
                  "Override Repo Patch Definition",
                  "Default to Repo Patch Definition",
                ],
                // @ts-expect-error: FIXME. This comment was added by an automated script.
                aliasArray.schema,
              ),
            },
            githubMQTriggerAliases: {
              type: "array" as const,
              title: "Merge Queue Trigger Aliases",
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
            // @ts-expect-error: FIXME. This comment was added by an automated script.
            githubProjectConflicts?.prTestingIdentifiers,
            formData?.github?.prTestingEnabled,
            repoData?.github?.prTestingEnabled,
            "PR Testing",
          ),
        },
        manualPrTestingEnabled: {
          "ui:data-cy": "manual-pr-testing-enabled-radio-box",
          "ui:widget": widgets.RadioBoxWidget,
          "ui:description": `
              Patches can be run manually by commenting ‘evergreen patch’ on the PR even if automated testing isn't enabled;
              The ‘--alias’ flag is also available to allow users to overwrite the default PR configuration.
          `,
          ...githubConflictErrorStyling(
            // @ts-expect-error: FIXME. This comment was added by an automated script.
            githubProjectConflicts?.prTestingIdentifiers,
            formData?.github?.manualPrTestingEnabled,
            repoData?.github?.manualPrTestingEnabled,
            "PR Testing",
          ),
        },
        oldestAllowedMergeBase: {
          "ui:description":
            "Specify the oldest commit SHA on your project branch that is allowed to be a merge base for a PR",
          "ui:optional": true,
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          ...placeholderIf(repoData?.github?.oldestAllowedMergeBase),
          ...hideIf(
            fieldDisabled(
              formData?.github?.prTestingEnabled,
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              repoData?.github?.prTestingEnabled,
            ) &&
              fieldDisabled(
                formData?.github?.manualPrTestingEnabled,
                // @ts-expect-error: FIXME. This comment was added by an automated script.
                repoData?.github?.manualPrTestingEnabled,
              ),
          ),
        },
        prTesting: {
          ...hideIf(
            fieldDisabled(
              formData?.github?.prTestingEnabled,
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              repoData?.github?.prTestingEnabled,
            ) &&
              fieldDisabled(
                formData?.github?.manualPrTestingEnabled,
                // @ts-expect-error: FIXME. This comment was added by an automated script.
                repoData?.github?.manualPrTestingEnabled,
              ),
          ),
          ...errorStyling(
            // @ts-expect-error: FIXME. This comment was added by an automated script.
            formData?.github?.prTestingEnabled,
            formData?.github?.prTesting?.githubPrAliasesOverride,
            formData?.github?.prTesting?.githubPrAliases,
            repoData?.github?.prTesting?.githubPrAliases,
            "GitHub Patch Definition",
          ),
          githubPrAliasesOverride: {
            "ui:data-cy": "pr-testing-override-radio-box",
            ...overrideStyling,
          },
          "ui:description": PRAliasesDescription,
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
          "ui:descriptionNode": (
            <GithubTriggerAliasDescription
              identifier={identifier}
              isPR
              isRepo={projectType === ProjectType.Repo}
            />
          ),
          items: {
            "ui:field": "githubTriggerAliasField",
            "ui:label": false,
          },
        },
        githubChecksEnabledTitle: {
          "ui:sectionTitle": true,
          "ui:description": GitHubChecksAliasesDescription(projectType),
        },
        githubChecksEnabled: {
          "ui:data-cy": "github-checks-enabled-radio-box",
          "ui:showLabel": false,
          "ui:widget": widgets.RadioBoxWidget,

          ...githubConflictErrorStyling(
            // @ts-expect-error: FIXME. This comment was added by an automated script.
            githubProjectConflicts?.commitCheckIdentifiers,
            formData?.github?.githubChecksEnabled,
            repoData?.github?.githubChecksEnabled,
            "Commit Checks",
          ),
        },
        githubChecks: {
          ...hideIf(
            fieldDisabled(
              formData?.github?.githubChecksEnabled,
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              repoData?.github?.githubChecksEnabled,
            ),
          ),
          ...errorStyling(
            formData?.github?.githubChecksEnabled,
            formData?.github?.githubChecks?.githubCheckAliasesOverride,
            formData?.github?.githubChecks?.githubCheckAliases,
            // @ts-expect-error: FIXME. This comment was added by an automated script.
            repoData?.github?.githubChecks?.githubCheckAliases,
            "Commit Check Definition",
          ),
          githubCheckAliasesOverride: overrideStyling,
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
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          repoData?.github?.gitTagVersionsEnabled,
        ),
        teams: userTeamStyling(
          "gitTagAuthorizedTeams",
          "Add Team",
          repoData?.github?.teams?.gitTagAuthorizedTeams === undefined,
          formData?.github?.gitTagVersionsEnabled,
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          repoData?.github?.gitTagVersionsEnabled,
        ),
        gitTags: {
          ...hideIf(
            fieldDisabled(
              formData?.github?.gitTagVersionsEnabled,
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              repoData?.github?.gitTagVersionsEnabled,
            ),
          ),
          ...errorStyling(
            // @ts-expect-error: FIXME. This comment was added by an automated script.
            formData?.github?.gitTagVersionsEnabled,
            formData?.github?.gitTags?.gitTagAliasesOverride,
            formData?.github?.gitTags?.gitTagAliases,
            repoData?.github?.gitTags?.gitTagAliases,
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
      mergeQueue: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        "ui:data-cy": "cq-card",
        enabled: {
          "ui:showLabel": false,
          "ui:widget": widgets.RadioBoxWidget,
          "ui:data-cy": "cq-enabled-radio-box",
          ...githubConflictErrorStyling(
            // @ts-expect-error: FIXME. This comment was added by an automated script.
            githubProjectConflicts?.commitQueueIdentifiers,
            formData?.mergeQueue?.enabled,
            repoData?.mergeQueue?.enabled,
            "the Merge Queue",
          ),
        },
        patchDefinitions: {
          ...hideIf(
            fieldDisabled(
              formData?.mergeQueue?.enabled,
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              repoData?.mergeQueue?.enabled,
            ),
          ),
          ...errorStyling(
            // @ts-expect-error: FIXME. This comment was added by an automated script.
            formData?.mergeQueue?.enabled,
            formData?.mergeQueue?.patchDefinitions?.mergeQueueAliasesOverride,
            formData?.mergeQueue?.patchDefinitions?.mergeQueueAliases,
            repoData?.mergeQueue?.patchDefinitions?.mergeQueueAliases,
            "Merge Queue Patch Definition",
          ),
          mergeQueueAliasesOverride: {
            "ui:data-cy": "cq-override-radio-box",
            ...overrideStyling,
          },
          "ui:description": MergeQueueAliasesDescription,
          mergeQueueAliases: {
            ...aliasRowUiSchema({
              addButtonText: "Add merge queue patch definition",
              numberedTitle: "Patch Definition",
            }),
          },
          repoData: {
            mergeQueueAliases: {
              ...aliasRowUiSchema({
                numberedTitle: "Repo Patch Definition",
                isRepo: true,
              }),
            },
          },
        },
        githubMQTriggerAliases: {
          "ui:data-cy": "github-mq-trigger-aliases",
          "ui:addable": false,
          "ui:orderable": false,
          "ui:placeholder": "No aliases are scheduled to run for merge queue.",
          "ui:readonly": true,
          "ui:removable": false,
          "ui:descriptionNode": (
            <GithubTriggerAliasDescription
              identifier={identifier}
              isRepo={projectType === ProjectType.Repo}
            />
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

const fieldDisabled = (field: boolean | null, repoField: boolean | null) =>
  field === false || (field === null && repoField === false);

const hideIf = (shouldHide: boolean) =>
  shouldHide && {
    "ui:widget": "hidden",
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

const GithubTriggerAliasDescription = ({
  identifier,
  isPR,
  isRepo,
}: {
  identifier: string;
  isRepo: boolean;
  isPR?: boolean;
}) => {
  const tab = ProjectSettingsTabRoutes.PatchAliases;
  return (
    <Description>
      Aliases can be configured to run for{" "}
      {isPR ? "pull requests" : "merge queue"} on the{" "}
      <StyledRouterLink
        to={
          isRepo
            ? getRepoSettingsRoute(identifier, tab)
            : getProjectSettingsRoute(identifier, tab)
        }
      >
        {getTabTitle(tab).title}
      </StyledRouterLink>{" "}
      page.
    </Description>
  );
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

const MergeQueueAliasesDescription = (
  <>
    Changes on the Merge Queue are tested with all variants and tasks that match
    each variant and task regex pair. These aliases{" "}
    <StyledLink href={mergeQueueAliasesDocumentationUrl}>
      may be defined
    </StyledLink>{" "}
    in this project&rsquo;s config YAML instead if Version Control is enabled
    and no aliases are defined on the project or repo page.
  </>
);

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

const GitHubChecksAliasesDescription = (projectType: ProjectType) => (
  <>
    Commits will send their status as a Github Check (the check will pass/fail
    based only on the tasks matching the tags/regexes definitions). These
    aliases{" "}
    <StyledLink href={githubChecksAliasesDocumentationUrl}>
      may be defined
    </StyledLink>{" "}
    in this project&rsquo;s config YAML instead if Version Control is enabled
    and no aliases are defined on the project or repo page.
    {projectType === ProjectType.Repo &&
      "If enabled, these settings can only apply to one branch project that also has this feature enabled. They do not apply to untracked branches."}
  </>
);
