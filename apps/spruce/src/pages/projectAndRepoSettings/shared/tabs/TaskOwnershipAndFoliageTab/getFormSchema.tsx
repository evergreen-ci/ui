import { InlineCode } from "@leafygreen-ui/typography";
import { StyledLink } from "@evg-ui/lib/components/styles";
import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import {
  backstageCatalogGroupsUrl,
  backstageCatalogUrl,
} from "constants/externalResources";
import { placeholderIf } from "../utils/form";
import { TaskOwnershipAndFoliageFormState } from "./types";

export const getFormSchema = (
  repoData?: TaskOwnershipAndFoliageFormState,
): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    type: "object" as const,
    properties: {
      taskOwnership: {
        type: "object" as const,
        title: "Mothra",
        properties: {
          mothra: {
            type: "object" as const,
            title: "",
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
        },
      },
    },
  },
  uiSchema: {
    taskOwnership: {
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      mothra: {
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
          ...placeholderIf(repoData?.taskOwnership?.mothra?.defaultMothraTeam),
        },
        defaultMothraTeamForBreakingCommit: {
          "ui:data-testid": "default-mothra-team-for-breaking-commit",
          "ui:description":
            "Foliage will alert breaking commits to the Slack channel defined for this team in Mothra. If not defined, it will fall back to the value above.",
          "ui:optional": true,
          ...placeholderIf(
            repoData?.taskOwnership?.mothra?.defaultMothraTeamForBreakingCommit,
          ),
        },
      },
    },
  },
});
