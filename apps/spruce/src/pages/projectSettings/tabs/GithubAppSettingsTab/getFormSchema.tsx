import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { GetFormSchema } from "components/SpruceForm";
import {
  CardFieldTemplate,
  FieldRow,
} from "components/SpruceForm/FieldTemplates";
import { StyledLink, StyledRouterLink } from "components/styles";
import { githubTokenPermissionRestrictionsUrl } from "constants/externalResources";
import {
  getProjectSettingsRoute,
  ProjectSettingsTabRoutes,
} from "constants/routes";
import { size } from "constants/tokens";
import { GitHubDynamicTokenPermissionGroup } from "gql/generated/types";
import { form } from "../utils";
import { GithubAppActions, RequesterTypeField } from "./Fields";
import { ArrayFieldTemplate } from "./FieldTemplates";

const { placeholderIf } = form;

const allPermissionsGroup = "";

/** No permissions is hardcoded in the Evergreen codebase as the given string. */
const noPermissionsGroup = "No Permissions";

export const getFormSchema = ({
  defaultsToRepo,
  githubPermissionGroups,
  identifier,
  isAppDefined,
  projectId,
  repoData,
  repoIdentifier,
}: {
  githubPermissionGroups: GitHubDynamicTokenPermissionGroup[];
  identifier: string;
  repoIdentifier: string;
  isAppDefined: boolean;
  projectId: string;
  repoData?: any;
  defaultsToRepo: boolean;
}): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    type: "object" as "object",
    properties: {
      appCredentials: {
        type: "object" as "object",
        title: "App Credentials",
        properties: {
          githubAppAuth: {
            type: "object" as "object",
            properties: {
              appId: {
                type: ["number", "null"],
                title: "App ID",
              },
              privateKey: {
                type: "string" as "string",
                title: "App Key",
              },
            },
          },
          actions: {
            type: "null" as "null",
            title: "",
          },
        },
      },
      tokenPermissionRestrictions: {
        type: "object" as "object",
        title: "Token Permission Restrictions",
        properties: {
          permissionsByRequester: {
            type: "array" as "array",
            items: {
              type: "object" as "object",
              properties: {
                requesterType: {
                  type: "string" as "string",
                  title: "",
                },
                permissionGroup: {
                  type: "string" as "string",
                  title: "",
                  default: allPermissionsGroup,
                  oneOf: [
                    {
                      type: "string" as "string",
                      title: "All app permissions",
                      enum: [allPermissionsGroup],
                    },
                    {
                      type: "string" as "string",
                      title: "No permissions",
                      enum: [noPermissionsGroup],
                    },
                    ...githubPermissionGroups.map((pg) => ({
                      type: "string" as "string",
                      title: pg.name,
                      enum: [pg.name],
                    })),
                  ],
                },
              },
            },
          },
        },
      },
    },
  },
  uiSchema: {
    appCredentials: {
      githubAppAuth: {
        "ui:ObjectFieldTemplate": FieldRow,
        "ui:elementWrapperCSS": css`
          align-items: flex-start;
        `,
        appId: {
          "ui:data-cy": "github-app-id-input",
          "ui:disabled": isAppDefined,
          "ui:elementWrapperCSS": appFieldCss,
          ...placeholderIf(repoData?.appCredentials?.githubAppAuth?.appId),
        },
        privateKey: {
          "ui:data-cy": "github-private-key-input",
          "ui:disabled": isAppDefined,
          "ui:elementWrapperCSS": appFieldCss,
          "ui:widget": "textarea",
          ...placeholderIf(repoData?.appCredentials?.githubAppAuth?.privateKey),
        },
      },
      actions: {
        "ui:field": GithubAppActions,
        "ui:showLabel": false,
        options: { isAppDefined, projectId },
      },
    },
    tokenPermissionRestrictions: {
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      "ui:description": (
        <StyledDescription>
          Dynamic Github Tokens generated by your project will have the full
          permissions of the Github app by default. Adding further restrictions
          will strengthen the security of your application. You can add
          restrictions either at the{" "}
          <StyledLink href={githubTokenPermissionRestrictionsUrl}>
            command level
          </StyledLink>{" "}
          or on this page using permission groups. Visit the{" "}
          <StyledRouterLink
            to={getProjectSettingsRoute(
              identifier,
              ProjectSettingsTabRoutes.GithubPermissionGroups,
            )}
          >
            GitHub Permission Groups tab
          </StyledRouterLink>{" "}
          to define permission groups.
        </StyledDescription>
      ),
      permissionsByRequester: defaultsToRepo
        ? {
            "ui:field": () => (
              <StyledDescription>
                Token permission restrictions are being defaulted to the{" "}
                <StyledRouterLink
                  to={getProjectSettingsRoute(
                    repoIdentifier,
                    ProjectSettingsTabRoutes.GithubAppSettings,
                  )}
                >
                  repository settings.
                </StyledRouterLink>{" "}
              </StyledDescription>
            ),
          }
        : {
            "ui:ArrayFieldTemplate": ArrayFieldTemplate,
            "ui:addable": false,
            "ui:orderable": false,
            "ui:removable": false,
            "ui:showLabel": false,
            items: {
              "ui:ObjectFieldTemplate": FieldRow,
              requesterType: {
                "ui:field": RequesterTypeField,
                "ui:elementWrapperCSS": tokenFieldCss,
                "ui:showLabel": false,
              },
              permissionGroup: {
                "ui:allowDeselect": false,
                "ui:ariaLabelledBy": "Permission Group",
                "ui:data-cy": "permission-group-input",
                "ui:elementWrapperCSS": tokenFieldCss,
                "ui:sizeVariant": "small",
              },
            },
          },
    },
  },
});

const tokenFieldCss = css`
  margin: ${size.xs} 0;
`;

const appFieldCss = css`
  max-width: unset;
`;

const StyledDescription = styled.span`
  display: block;
  margin-bottom: ${size.xs};
`;
