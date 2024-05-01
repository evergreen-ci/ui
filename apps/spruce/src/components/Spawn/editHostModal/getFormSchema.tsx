import { css } from "@emotion/react";
import { Label } from "@leafygreen-ui/typography";
import { GetFormSchema } from "components/SpruceForm/types";
import { StyledLink } from "components/styles";
import { windowsPasswordRulesURL } from "constants/externalResources";
import { size } from "constants/tokens";
import { MyPublicKeysQuery, MyVolumesQuery } from "gql/generated/types";
import {
  getExpirationDetailsSchema,
  getPublicKeySchema,
} from "../getFormSchema";
import { getDefaultExpiration } from "../utils";

interface Props {
  canEditInstanceType: boolean;
  canEditRdpPassword: boolean;
  canEditSshKeys: boolean;
  disableExpirationCheckbox: boolean;
  hostUptimeValidation?: {
    enabledHoursCount: number;
    errors: string[];
    warnings: string[];
  };
  instanceTypes: string[];
  myPublicKeys: MyPublicKeysQuery["myPublicKeys"];
  noExpirationCheckboxTooltip: string;
  timeZone?: string;
  volumes: MyVolumesQuery["myVolumes"];
}

export const getFormSchema = ({
  canEditInstanceType,
  canEditRdpPassword,
  canEditSshKeys,
  disableExpirationCheckbox,
  hostUptimeValidation,
  instanceTypes,
  myPublicKeys,
  noExpirationCheckboxTooltip,
  timeZone,
  volumes,
}: Props): ReturnType<GetFormSchema> => {
  const defaultExpiration = getDefaultExpiration();

  const expirationDetails = getExpirationDetailsSchema({
    defaultExpiration,
    disableExpirationCheckbox,
    hostUptimeValidation,
    noExpirationCheckboxTooltip,
    timeZone,
  });
  const publicKeys = getPublicKeySchema({ canEditSshKeys, myPublicKeys });

  return {
    fields: {},
    schema: {
      type: "object" as "object",
      properties: {
        hostName: {
          title: "Edit Host Name",
          type: "string",
          default: "",
        },
        instanceType: {
          title: "Change Instance Type",
          type: "string" as "string",
          default: "",
          oneOf: instanceTypes.map((it) => ({
            type: "string" as "string",
            title: it,
            enum: [it],
          })),
        },
        volume: {
          title: "Add Volume",
          type: "string" as "string",
          default: "",
          oneOf: [
            {
              type: "string" as "string",
              title: "Select volume…",
              enum: [""],
            },
            ...volumes.map((v) => ({
              type: "string" as "string",
              title: `(${v.size}GB) ${v.displayName || v.id}`,
              enum: [v.id],
            })),
          ],
        },
        ...(canEditRdpPassword && {
          rdpPassword: {
            title: "Set New RDP Password",
            type: "string",
            default: "",
          },
        }),
        userTags: {
          title: "",
          type: "array" as "array",
          items: {
            type: "object" as "object",
            properties: {
              key: {
                type: "string" as "string",
                title: "Key",
                default: "",
              },
              value: {
                type: "string" as "string",
                title: "Value",
                default: "",
              },
            },
          },
        },
        expirationDetails: expirationDetails.schema,
        publicKeySection: publicKeys.schema,
      },
    },
    uiSchema: {
      instanceType: {
        "ui:description": !canEditInstanceType
          ? "Instance type can only be changed when the host is stopped."
          : "",
        "ui:disabled": !canEditInstanceType,
        "ui:allowDeselect": false,
      },
      volume: {
        "ui:allowDeselect": false,
        "ui:disabled": volumes.length === 0,
        "ui:description": volumes.length === 0 ? "No volumes available." : "",
      },
      rdpPassword: {
        // Console error should be resolved by https://jira.mongodb.org/browse/LG-2342.
        "ui:description": (
          <>
            Password should match the criteria defined{" "}
            <StyledLink href={windowsPasswordRulesURL} target="__blank">
              here.
            </StyledLink>
          </>
        ),
      },
      userTags: {
        "ui:addButtonText": "Add Tag",
        "ui:descriptionNode": (
          <Label htmlFor="root_userTags">Add User Tags</Label>
        ),
        "ui:orderable": false,
        items: {
          "ui:id": "testing",
          "ui:elementWrapperCSS": css`
            display: flex;
            gap: ${size.s};
          `,
        },
      },
      expirationDetails: {
        ...expirationDetails.uiSchema,
        "ui:elementWrapperCSS": css`
          margin-bottom: ${size.s};
        `,
      },
      publicKeySection: publicKeys.uiSchema,
    },
  };
};
