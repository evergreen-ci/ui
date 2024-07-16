import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Description } from "@leafygreen-ui/typography";
import { GetFormSchema } from "components/SpruceForm";
import { StyledLink, StyledRouterLink } from "components/styles";
import { githubPermissionsDocumentationUrl } from "constants/externalResources";
import {
  getProjectSettingsRoute,
  ProjectSettingsTabRoutes,
} from "constants/routes";
import { size } from "constants/tokens";
import {
  PermissionArrayFieldTemplate,
  PermissionObjectFieldTemplate,
} from "./FieldTemplates";

export const getFormSchema = ({
  identifier,
}: {
  identifier: string;
}): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    type: "object" as "object",
    properties: {
      permissionGroups: {
        type: "array" as "array",
        title: "Token Permission Groups",
        items: {
          type: "object" as "object",
          properties: {
            name: {
              type: "string" as "string",
              title: "",
              default: "",
              minLength: 1,
            },
            permissions: {
              type: "array" as "array",
              default: [],
              items: {
                type: "object" as "object",
                properties: {
                  type: {
                    type: "string" as "string",
                    title: "",
                    default: "",
                    minLength: 1,
                  },
                  value: {
                    type: "string" as "string",
                    title: "",
                    default: "",
                    minLength: 1,
                    oneOf: [
                      {
                        type: "string" as "string",
                        title: "Select...",
                        enum: [""],
                      },
                      {
                        type: "string" as "string",
                        title: "Read",
                        enum: ["read"],
                      },
                      {
                        type: "string" as "string",
                        title: "Write",
                        enum: ["write"],
                      },
                      {
                        type: "string" as "string",
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
            href={githubPermissionsDocumentationUrl}
            hideExternalIcon={false}
          >
            Learn more about GitHub permissions
          </StyledLink>
        </>
      ),
      "ui:orderable": false,
      "ui:useExpandableCard": true,
      items: {
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
          "ui:ArrayFieldTemplate": PermissionArrayFieldTemplate,
          "ui:addButtonText": "Add permission",
          "ui:addToEnd": true,
          "ui:orderable": false,
          "ui:placeholder": "No permissions have been added.",
          "ui:showLabel": false,
          "ui:topAlignDelete": true,
          items: {
            "ui:ObjectFieldTemplate": PermissionObjectFieldTemplate,
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
      },
    },
  },
});

const StyledDescription = styled(Description)`
  margin-bottom: ${size.xs};
`;

const permissionCss = css`
  margin: ${size.xs} 0;
  width: 100%;
`;
