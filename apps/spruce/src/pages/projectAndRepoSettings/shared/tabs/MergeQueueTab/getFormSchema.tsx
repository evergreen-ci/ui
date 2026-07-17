import { Description } from "@leafygreen-ui/typography";
import { StyledLink, StyledRouterLink } from "@evg-ui/lib/components/styles";
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
  fieldDisabled,
  form,
  githubConflictErrorStyling,
  hideIf,
  ProjectType,
  sectionHasError,
} from "../utils";
import { GithubTriggerAliasField } from "./GithubTriggerAliasField";
import { MergeQueueFormState } from "./types";

const { aliasArray, aliasRowUiSchema } = alias;
const { overrideRadioBox, radioBoxOptions } = form;

export const getFormSchema = (
  identifier: string,
  projectType: ProjectType,
  githubWebhooksEnabled: boolean,
  formData: MergeQueueFormState,
  githubProjectConflicts: GithubProjectConflicts,
  versionControlEnabled: boolean,
  repoData?: MergeQueueFormState,
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
    fields: {
      githubTriggerAliasField: GithubTriggerAliasField,
    },
    schema: {
      properties: {
        mergeQueue: {
          title: "",
          type: "object" as const,
          ...(projectType === ProjectType.Repo && {
            description:
              "If enabled, these settings can only apply to one branch project that also has this feature enabled. They do not apply to untracked branches.",
          }),
          properties: {
            enabled: {
              oneOf: radioBoxOptions(
                ["Enabled", "Disabled"],
                repoData?.mergeQueue?.enabled ?? undefined,
              ),
              title: "",
              type: ["boolean", "null"],
            },
            enabledTitle: {
              title: "Merge Queue",
              type: "null" as const,
            },
            githubMQTriggerAliases: {
              items: {
                type: "object" as const,
              },
              title: "Merge Queue Trigger Aliases",
              type: "array" as const,
            },
            patchDefinitions: {
              title: "Merge Queue Patch Definitions",
              type: "object" as const,
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
            webhooksStatus: {
              description: `GitHub webhooks ${
                githubWebhooksEnabled ? "are" : "are not"
              } enabled.`,
              title: "GitHub Webhooks",
              type: "null" as const,
            },
          },
        },
      },
      type: "object" as const,
    },
    uiSchema: {
      mergeQueue: {
        enabled: {
          "ui:data-cy": "mq-enabled-radio-box",
          "ui:showLabel": false,
          "ui:widget": widgets.RadioBoxWidget,
          ...githubConflictErrorStyling(
            githubProjectConflicts?.commitQueueIdentifiers ?? null,
            formData?.mergeQueue?.enabled,
            repoData?.mergeQueue?.enabled ?? false,
            "the Merge Queue",
          ),
        },
        githubMQTriggerAliases: {
          items: {
            "ui:field": "githubTriggerAliasField",
            "ui:label": false,
          },
          "ui:addable": false,
          "ui:data-cy": "github-mq-trigger-aliases",
          "ui:descriptionNode": (
            <GithubTriggerAliasDescription
              identifier={identifier}
              isRepo={projectType === ProjectType.Repo}
            />
          ),
          "ui:orderable": false,
          "ui:placeholder": "No aliases are scheduled to run for merge queue.",
          "ui:readonly": true,
          "ui:removable": false,
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
            formData?.mergeQueue?.enabled ?? false,
            formData?.mergeQueue?.patchDefinitions?.mergeQueueAliasesOverride,
            formData?.mergeQueue?.patchDefinitions?.mergeQueueAliases,
            repoData?.mergeQueue?.patchDefinitions?.mergeQueueAliases ?? [],
            "Merge Queue Patch Definition",
          ),
          mergeQueueAliases: {
            ...aliasRowUiSchema({
              addButtonText: "Add merge queue patch definition",
              numberedTitle: "Patch Definition",
            }),
          },
          mergeQueueAliasesOverride: {
            "ui:data-cy": "mq-override-radio-box",
            ...overrideStyling,
          },
          repoData: {
            mergeQueueAliases: {
              ...aliasRowUiSchema({
                isRepo: true,
                numberedTitle: "Repo Patch Definition",
              }),
            },
          },
          "ui:description": MergeQueueAliasesDescription,
        },
        "ui:data-cy": "mq-card",
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        "ui:showLabel": false,
      },
    },
  };
};

const GithubTriggerAliasDescription = ({
  identifier,
  isRepo,
}: {
  identifier: string;
  isRepo: boolean;
}) => {
  const tab = ProjectSettingsTabRoutes.PatchAliases;
  return (
    <Description>
      Aliases can be configured to run on the merge queue on the{" "}
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
