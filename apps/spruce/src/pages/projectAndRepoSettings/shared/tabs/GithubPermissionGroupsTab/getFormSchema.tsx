import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Description } from "@leafygreen-ui/typography";
import { StyledLink, StyledRouterLink } from "@evg-ui/lib/components/styles";
import { size } from "@evg-ui/lib/constants/tokens";
import { GetFormSchema } from "components/SpruceForm";
import { FieldRow } from "components/SpruceForm/FieldTemplates";
import { githubPermissionsDocumentationUrl } from "constants/externalResources";
import {
  ProjectSettingsTabRoutes,
  getProjectSettingsRoute,
} from "constants/routes";
import { ArrayFieldTemplate } from "./FieldTemplates";

export const getFormSchema = ({
  defaultsToRepo,
  identifier,
}: {
  identifier: string;
  defaultsToRepo: boolean;
}): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    definitions: {
      permissionGroupsArray: {
        items: {
          properties: {
            name: {
              default: "",
              minLength: 1,
              title: "",
              type: "string" as const,
            },
            permissions: {
              default: [],
              items: {
                properties: {
                  type: {
                    default: "",
                    minLength: 1,
                    title: "",
                    type: "string" as const,
                  },
                  value: {
                    default: "",
                    minLength: 1,
                    oneOf: [
                      {
                        enum: [""],
                        title: "Select...",
                        type: "string" as const,
                      },
                      {
                        enum: ["read"],
                        title: "Read",
                        type: "string" as const,
                      },
                      {
                        enum: ["write"],
                        title: "Write",
                        type: "string" as const,
                      },
                      {
                        enum: ["admin"],
                        title: "Admin",
                        type: "string" as const,
                      },
                    ],
                    title: "",
                    type: "string" as const,
                  },
                },
                type: "object" as const,
              },
              type: "array" as const,
            },
          },
          type: "object" as const,
        },
        title: "",
        type: "array" as const,
      },
    },
    properties: {
      // Only show one of project or repo permission group at a time.
      // Show project permission groups for the project if it's not using repo's GitHub app.
      ...(!defaultsToRepo && {
        permissionGroups: {
          $ref: "#/definitions/permissionGroupsArray",
          title: "Token Permission Groups",
        },
      }),
      // Show repo permission groups for the project if it is using repo's GitHub app.
      ...(defaultsToRepo && {
        repoData: {
          properties: {
            permissionGroups: {
              $ref: "#/definitions/permissionGroupsArray",
              title: "Repo Token Permission Groups",
            },
          },
          title: "",
          type: "object" as const,
        },
      }),
    },
    type: "object" as const,
  },
  uiSchema: {
    permissionGroups: {
      items: itemsUISchema,
      "ui:addButtonText": "Add permission group",
      "ui:data-cy": "permission-group-list",
      "ui:descriptionNode": (
        <>
          <StyledDescription>
            Create permission groups containing a set of permissions for
            generated tokens. Permission groups can be applied to one or more
            requester types in the{" "}
            <StyledRouterLink
              to={getProjectSettingsRoute(
                identifier,
                ProjectSettingsTabRoutes.GithubAppSettings,
              )}
            >
              GitHub App Settings tab
            </StyledRouterLink>
            . When assigned to a requester type, the generated token will only
            have the permissions that are defined on this page.
          </StyledDescription>
          <StyledLink
            hideExternalIcon={false}
            href={githubPermissionsDocumentationUrl}
          >
            Learn more about GitHub permissions
          </StyledLink>
        </>
      ),
      "ui:orderable": false,
      "ui:useExpandableCard": true,
    },
    repoData: {
      permissionGroups: {
        ...(!defaultsToRepo && { "ui:widget": "hidden" }),
        items: itemsUISchema,
        "ui:addable": false,
        "ui:data-cy": "permission-group-list",
        "ui:descriptionNode": (
          <StyledDescription>
            This project is using the GitHub app defined in the corresponding
            repo, and is inheriting the repo&apos;s permission groups. You must
            create and define a GitHub app specifically for this project if you
            want to override the following settings.
          </StyledDescription>
        ),
        "ui:orderable": false,
        "ui:placeholder": "There are no permission groups defined in the repo.",
        "ui:useExpandableCard": true,
      },
      "ui:readonly": true,
    },
  },
});

const permissionCss = css`
  margin: ${size.xs} 0;
  width: 100%;
`;

const itemsUISchema = {
  name: {
    "ui:ariaLabelledBy": "Permission Group Name",
    "ui:data-cy": "permission-group-title-input",
    "ui:elementWrapperCSS": css`
      max-width: unset;
      width: 90%;
    `,
  },
  permissions: {
    items: {
      type: {
        "ui:ariaLabelledBy": "GitHub Permission Type",
        "ui:data-cy": "permission-type-input",
        "ui:elementWrapperCSS": permissionCss,
      },
      "ui:ObjectFieldTemplate": FieldRow,
      value: {
        "ui:allowDeselect": false,
        "ui:ariaLabelledBy": "GitHub Permission Value",
        "ui:data-cy": "permission-value-input",
        "ui:elementWrapperCSS": permissionCss,
      },
    },
    "ui:addButtonText": "Add permission",
    "ui:addToEnd": true,
    "ui:ArrayFieldTemplate": ArrayFieldTemplate,
    "ui:orderable": false,
    "ui:placeholder": "No permissions have been added.",
    "ui:showLabel": false,
    "ui:topAlignDelete": true,
  },
  "ui:data-cy": "permission-group",
  "ui:displayTitle": "New Permission Group",
};

const StyledDescription = styled(Description)`
  margin-bottom: ${size.xs};
`;
