import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { StyledLink, StyledRouterLink } from "@evg-ui/lib/components/styles";
import { size } from "@evg-ui/lib/constants/tokens";
import { GetFormSchema } from "components/SpruceForm";
import {
  CardFieldTemplate,
  FieldRow,
} from "components/SpruceForm/FieldTemplates";
import { githubTokenPermissionRestrictionsUrl } from "constants/externalResources";
import {
  ProjectSettingsTabRoutes,
  getProjectSettingsRoute,
} from "constants/routes";
import { GitHubDynamicTokenPermissionGroup } from "gql/generated/types";
import { form } from "../utils";
import { GithubAppActions, RequesterTypeField } from "./Fields";
import { ArrayFieldTemplate } from "./FieldTemplates";
import { AppSettingsFormState } from "./types";

const { placeholderIf } = form;

const allPermissionsGroup = "";

/** No permissions is hardcoded in the Evergreen codebase as the given string. */
const noPermissionsGroup = "No Permissions";

export const getFormSchema = ({
  defaultsToRepo,
  githubPermissionGroups,
  identifier,
  isAppDefined,
  isRepo,
  projectOrRepoId,
  repoData,
}: {
  githubPermissionGroups: GitHubDynamicTokenPermissionGroup[];
  identifier: string;
  isAppDefined: boolean;
  isRepo: boolean;
  projectOrRepoId: string;
  repoData?: AppSettingsFormState;
  defaultsToRepo: boolean;
}): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    definitions: {
      tokenPermissionRestrictionsObject: {
        properties: {
          permissionsByRequester: {
            items: {
              properties: {
                permissionGroup: {
                  default: allPermissionsGroup,
                  oneOf: [
                    {
                      enum: [allPermissionsGroup],
                      title: "All app permissions",
                      type: "string" as const,
                    },
                    {
                      enum: [noPermissionsGroup],
                      title: "No permissions",
                      type: "string" as const,
                    },
                    ...githubPermissionGroups.map((pg) => ({
                      enum: [pg.name],
                      title: pg.name,
                      type: "string" as const,
                    })),
                  ],
                  title: "",
                  type: "string" as const,
                },
                requesterType: {
                  title: "",
                  type: "string" as const,
                },
              },
              type: "object" as const,
            },
            type: "array" as const,
          },
        },
        title: "Token Permission Restrictions",
        type: "object" as const,
      },
    },
    properties: {
      appCredentials: {
        properties: {
          actions: {
            title: "",
            type: "null" as const,
          },
          githubAppAuth: {
            properties: {
              appId: {
                title: "App ID",
                type: ["number", "null"],
              },
              privateKey: {
                title: "App Key",
                type: "string" as const,
              },
            },
            type: "object" as const,
          },
        },
        title: "App Credentials",
        type: "object" as const,
      },
      repoData: {
        properties: {
          tokenPermissionRestrictions: {
            $ref: "#/definitions/tokenPermissionRestrictionsObject",
            title: "Repo Token Permission Restrictions",
          },
        },
        title: "",
        type: "object" as const,
      },
      tokenPermissionRestrictions: {
        $ref: "#/definitions/tokenPermissionRestrictionsObject",
        title: "Token Permission Restrictions",
      },
    },
    type: "object" as const,
  },
  uiSchema: {
    appCredentials: {
      actions: {
        options: { defaultsToRepo, isAppDefined, isRepo, projectOrRepoId },
        "ui:field": GithubAppActions,
        "ui:showLabel": false,
      },
      githubAppAuth: {
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
        "ui:elementWrapperCSS": css`
          align-items: flex-start;
        `,
        "ui:ObjectFieldTemplate": FieldRow,
      },
    },
    repoData: {
      tokenPermissionRestrictions: {
        ...(!defaultsToRepo && { "ui:widget": "hidden" }),
        permissionsByRequester: permissionsByRequesterUISchema,
        "ui:description": (
          <StyledDescription>
            This project is using the GitHub app defined in the corresponding
            repo, and is inheriting the repo&apos;s token permission
            restrictions. You must create and define a GitHub app specifically
            for this project if you want to override the following settings.
          </StyledDescription>
        ),
        "ui:ObjectFieldTemplate": CardFieldTemplate,
      },
      "ui:readonly": true,
    },
    tokenPermissionRestrictions: {
      ...(defaultsToRepo && { "ui:widget": "hidden" }),
      permissionsByRequester: permissionsByRequesterUISchema,
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
      "ui:ObjectFieldTemplate": CardFieldTemplate,
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

const permissionsByRequesterUISchema = {
  items: {
    permissionGroup: {
      "ui:allowDeselect": false,
      "ui:ariaLabelledBy": "Permission Group",
      "ui:data-cy": "permission-group-input",
      "ui:elementWrapperCSS": tokenFieldCss,
      "ui:sizeVariant": "small",
    },
    requesterType: {
      "ui:elementWrapperCSS": tokenFieldCss,
      "ui:field": RequesterTypeField,
      "ui:showLabel": false,
    },
    "ui:ObjectFieldTemplate": FieldRow,
  },
  "ui:addable": false,
  "ui:ArrayFieldTemplate": ArrayFieldTemplate,
  "ui:orderable": false,
  "ui:removable": false,
  "ui:showLabel": false,
};
