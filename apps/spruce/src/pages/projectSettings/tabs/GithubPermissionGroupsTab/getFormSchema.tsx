import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Description } from "@leafygreen-ui/typography";
import { GetFormSchema } from "components/SpruceForm";
import { StyledLink } from "components/styles";
import { githubPermissionsDocumentationUrl } from "constants/externalResources";
import { size } from "constants/tokens";
import {
  PermissionArrayFieldTemplate,
  PermissionObjectFieldTemplate,
} from "./FieldTemplates";

export const getFormSchema = (): ReturnType<GetFormSchema> => ({
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
      "ui:orderable": false,
      "ui:addButtonText": "Add permission group",
      "ui:descriptionNode": (
        <>
          <StyledDescription>
            Create permission groups containing a set of permissions for
            generated tokens. Permission groups can be applied to one or more
            requester types in the GitHub App Settings tab. When assigned to a
            requester type, the generated token will only have the permissions
            that are defined on this page.
          </StyledDescription>
          <StyledLink
            href={githubPermissionsDocumentationUrl}
            hideExternalIcon={false}
          >
            Learn more about GitHub permissions
          </StyledLink>
        </>
      ),
      "ui:useExpandableCard": true,
      "ui:data-cy": "permission-group-list",
      items: {
        "ui:displayTitle": "New Permission Group",
        name: {
          "ui:data-cy": "permission-group-title-input",
          "ui:ariaLabelledBy": "Permission Group Name",
          "ui:elementWrapperCSS": css`
            max-width: unset;
            width: 90%;
          `,
        },
        permissions: {
          "ui:showLabel": false,
          "ui:orderable": false,
          "ui:addButtonText": "Add permission",
          "ui:addToEnd": true,
          "ui:topAlignDelete": true,
          "ui:placeholder": "No permissions have been added.",
          "ui:ArrayFieldTemplate": PermissionArrayFieldTemplate,
          items: {
            "ui:ObjectFieldTemplate": PermissionObjectFieldTemplate,
            type: {
              "ui:data-cy": "permission-type-input",
              "ui:ariaLabelledBy": "GitHub Permission Type",
              "ui:elementWrapperCSS": permissionCss,
            },
            value: {
              "ui:data-cy": "permission-value-input",
              "ui:ariaLabelledBy": "GitHub Permission Value",
              "ui:allowDeselect": false,
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
