import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Description } from "@leafygreen-ui/typography";
import { StyledLink, StyledRouterLink } from "@evg-ui/lib/components";
import { size } from "@evg-ui/lib/constants";
import { GetFormSchema } from "components/SpruceForm";
import { FieldRow } from "components/SpruceForm/FieldTemplates";
import { githubPermissionsDocumentationUrl } from "constants/externalResources";
import {
  getProjectSettingsRoute,
  ProjectSettingsTabRoutes,
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
        type: "array" as const,
        title: "",
        items: {
          type: "object" as const,
          properties: {
            name: {
              type: "string" as const,
              title: "",
              default: "",
              minLength: 1,
            },
            permissions: {
              type: "array" as const,
              default: [],
              items: {
                type: "object" as const,
                properties: {
                  type: {
                    type: "string" as const,
                    title: "",
                    default: "",
                    minLength: 1,
                  },
                  value: {
                    type: "string" as const,
                    title: "",
                    default: "",
                    minLength: 1,
                    oneOf: [
                      {
                        type: "string" as const,
                        title: "Select...",
                        enum: [""],
                      },
                      {
                        type: "string" as const,
                        title: "Read",
                        enum: ["read"],
                      },
                      {
                        type: "string" as const,
                        title: "Write",
                        enum: ["write"],
                      },
                      {
                        type: "string" as const,
                        title: "Admin",
                        enum: ["admin"],
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
    },
    type: "object" as const,
    properties: {
      // Only show one of project or repo permission group at a time.
      // Show project permission groups for the project if it's not using repo's GitHub app.
      ...(!defaultsToRepo && {
        permissionGroups: {
          title: "Token Permission Groups",
          $ref: "#/definitions/permissionGroupsArray",
        },
      }),
      // Show repo permission groups for the project if it is using repo's GitHub app.
      ...(defaultsToRepo && {
        repoData: {
          type: "object" as const,
          title: "",
          properties: {
            permissionGroups: {
              title: "Repo Token Permission Groups",
              $ref: "#/definitions/permissionGroupsArray",
            },
          },
        },
      }),
    },
  },
  uiSchema: {
    permissionGroups: {
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
      items: itemsUISchema,
    },
    repoData: {
      "ui:readonly": true,
      permissionGroups: {
        ...(!defaultsToRepo && { "ui:widget": "hidden" }),
        "ui:descriptionNode": (
          <StyledDescription>
            This project is using the GitHub app defined in the corresponding
            repo, and is inheriting the repo&apos;s permission groups. You must
            create and define a GitHub app specifically for this project if you
            want to override the following settings.
          </StyledDescription>
        ),
        "ui:addable": false,
        "ui:data-cy": "permission-group-list",
        "ui:orderable": false,
        "ui:useExpandableCard": true,
        "ui:placeholder": "There are no permission groups defined in the repo.",
        items: itemsUISchema,
      },
    },
  },
});

const permissionCss = css`
  margin: ${size.xs} 0;
  width: 100%;
`;

const itemsUISchema = {
  "ui:displayTitle": "New Permission Group",
  name: {
    "ui:ariaLabelledBy": "Permission Group Name",
    "ui:data-cy": "permission-group-title-input",
    "ui:elementWrapperCSS": css`
      max-width: unset;
      width: 90%;
    `,
  },
  permissions: {
    "ui:ArrayFieldTemplate": ArrayFieldTemplate,
    "ui:addButtonText": "Add permission",
    "ui:addToEnd": true,
    "ui:orderable": false,
    "ui:placeholder": "No permissions have been added.",
    "ui:showLabel": false,
    "ui:topAlignDelete": true,
    items: {
      "ui:ObjectFieldTemplate": FieldRow,
      type: {
        "ui:ariaLabelledBy": "GitHub Permission Type",
        "ui:data-cy": "permission-type-input",
        "ui:elementWrapperCSS": permissionCss,
      },
      value: {
        "ui:allowDeselect": false,
        "ui:ariaLabelledBy": "GitHub Permission Value",
        "ui:data-cy": "permission-value-input",
        "ui:elementWrapperCSS": permissionCss,
      },
    },
  },
};

const StyledDescription = styled(Description)`
  margin-bottom: ${size.xs};
`;
