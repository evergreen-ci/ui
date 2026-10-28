import { InlineCode } from "@leafygreen-ui/typography";
import { StyledLink } from "@evg-ui/lib/components/styles";
import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import {
  backstageCatalogGroupsUrl,
  backstageCatalogUrl,
} from "constants/externalResources";
import { form } from "../utils";
import { placeholderIf } from "../utils/form";
import { TaskOwnershipAndFoliageFormState } from "./types";

const { radioBoxOptions } = form;

export const getFormSchema = (
  repoData?: TaskOwnershipAndFoliageFormState,
): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    type: "object" as const,
    properties: {
      mothra: {
        type: "object" as const,
        title: "Mothra",
        properties: {
          defaultMothraTeam: {
            type: "string" as const,
            title: "Default Mothra Team",
            default: "",
          },
          defaultMothraTeamForBreakingCommit: {
            type: "string" as const,
            title: "Default Mothra Team for Breaking Commit",
            default: "",
          },
        },
      },
      tagValidation: {
        type: "object" as const,
        title: "Tag Validation",
        properties: {
          generatedTaskValidationPrefix: {
            type: "string" as const,
            title: "Generated Task Validation Prefix",
            default: "",
          },
          trackGeneratedTaskTagValidation: {
            type: ["boolean", "null"] as const,
            title: "Track Generated Task Tag Validation",
            oneOf: radioBoxOptions(
              ["Enabled", "Disabled"],
              repoData?.tagValidation?.trackGeneratedTaskTagValidation ??
                undefined,
            ),
          },
          blockTaskGenerationOnTagValidation: {
            type: ["boolean", "null"] as const,
            title: "Block Task Generation on Tag Validation",
            oneOf: radioBoxOptions(
              ["Enabled", "Disabled"],
              repoData?.tagValidation?.blockTaskGenerationOnTagValidation ??
                undefined,
            ),
          },
        },
      },
    },
  },
  uiSchema: {
    mothra: {
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      "ui:description": (
        <span>
          Team names can be found in the{" "}
          <StyledLink href={backstageCatalogGroupsUrl}>
            Backstage Catalog
          </StyledLink>{" "}
          . Look for the &ldquo;Evergreen Tags&rdquo; field. For example,
          Evergreen UI&apos;s Mothra team would be equal to{" "}
          <InlineCode>devprod_evergreen_ui</InlineCode> according to{" "}
          <StyledLink
            href={`${backstageCatalogUrl}/default/group/mothra-devprod-evergreen-ui`}
          >
            its catalog entry
          </StyledLink>
          .
        </span>
      ),
      defaultMothraTeam: {
        "ui:data-testid": "default-mothra-team",
        "ui:description":
          "The default team that will be used for labeling task owners in Evergreen and for Foliage Jira ticket assignments.",
        "ui:optional": true,
        ...placeholderIf(repoData?.mothra?.defaultMothraTeam),
      },
      defaultMothraTeamForBreakingCommit: {
        "ui:data-testid": "default-mothra-team-for-breaking-commit",
        "ui:description":
          "Foliage will alert breaking commits to the Slack channel defined for this team in Mothra. If not defined, it will fall back to the value above.",
        "ui:optional": true,
        ...placeholderIf(repoData?.mothra?.defaultMothraTeamForBreakingCommit),
      },
    },
    tagValidation: {
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      "ui:description":
        "Validate that generated tasks follow the task ownership tagging convention.",
      generatedTaskValidationPrefix: {
        "ui:data-testid": "generated-task-validation-prefix",
        "ui:description":
          "The prefix for task tags that indicate team ownership.",
        "ui:optional": true,
        ...placeholderIf(
          repoData?.tagValidation?.generatedTaskValidationPrefix,
        ),
      },
      trackGeneratedTaskTagValidation: {
        "ui:data-testid": "track-generated-task-tag-validation",
        "ui:description":
          "Track generate.tasks when it creates tasks that don't have a task tag with the validation prefix.",
        "ui:widget": widgets.RadioBoxWidget,
      },
      blockTaskGenerationOnTagValidation: {
        "ui:data-testid": "block-task-generation-on-tag-validation",
        "ui:description":
          "Fail generate.tasks entirely if any task about to be generated doesn't have a task tag with the validation prefix.",
        "ui:widget": widgets.RadioBoxWidget,
      },
    },
  },
});
