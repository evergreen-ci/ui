import { Description } from "@leafygreen-ui/typography";
import { StyledRouterLink, StyledLink } from "@evg-ui/lib/components/styles";
import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import { mergeQueueAliasesDocumentationUrl } from "constants/externalResources";
import {
  getProjectSettingsRoute,
  getRepoSettingsRoute,
  ProjectSettingsTabRoutes,
} from "constants/routes";
import { GithubProjectConflicts } from "gql/generated/types";
import { getTabTitle } from "../../getTabTitle";
import {
  alias,
  form,
  ProjectType,
  githubConflictErrorStyling,
  sectionHasError,
} from "../utils";
import { GithubTriggerAliasField } from "./GithubTriggerAliasField";
import { MergeQueueFormState } from "./types";

const { aliasArray, aliasRowUiSchema } = alias;
const { overrideRadioBox, radioBoxOptions } = form;

export const getFormSchema = (
  identifier: string,
  projectType: ProjectType,
  githubWebhooksEnabled: boolean, // kept for signature compatibility, unused
  formData: MergeQueueFormState,
  githubProjectConflicts: GithubProjectConflicts,
  versionControlEnabled: boolean,
  repoData?: MergeQueueFormState,
): ReturnType<GetFormSchema> => {
  const errorStyling = sectionHasError(versionControlEnabled, projectType);

  return {
    fields: {
      githubTriggerAliasField: GithubTriggerAliasField,
    },
    schema: {
      type: "object" as const,
      properties: {
        mergeQueue: {
          type: "object" as const,
          title: "",
          ...(projectType === ProjectType.Repo && {
            description:
              "If enabled, these settings can only apply to one branch project that also has this feature enabled. They do not apply to untracked branches.",
          }),
          properties: {
            webhooksStatus: {
              type: "null" as const,
              title: "GitHub Webhooks",
              description: `GitHub webhooks ${
                githubWebhooksEnabled ? "are" : "are not"
              } enabled.`,
            },
            enabledTitle: {
              type: "null" as const,
              title: "Merge Queue",
            },
            enabled: {
              type: ["boolean", "null"],
              title: "",
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
      mergeQueue: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        "ui:data-cy": "cq-card",
        "ui:showLabel": false,
        enabledTitle: {},
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
            ...overrideStyling(
              repoData?.mergeQueue?.patchDefinitions?.mergeQueueAliases ===
                undefined,
            ),
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
