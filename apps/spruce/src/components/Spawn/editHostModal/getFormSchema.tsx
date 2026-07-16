import { css } from "@emotion/react";
import { Label } from "@leafygreen-ui/typography";
import { StyledLink } from "@evg-ui/lib/components/styles";
import { size } from "@evg-ui/lib/constants/tokens";
import { GetFormSchema } from "components/SpruceForm/types";
import { windowsPasswordRulesURL } from "constants/externalResources";
import { MyPublicKeysQuery, MyVolumesQuery } from "gql/generated/types";
import {
  getExpirationDetailsSchema,
  getPublicKeySchema,
} from "../getFormSchema";

interface Props {
  canEditInstanceType: boolean;
  canEditRdpPassword: boolean;
  canEditSshKeys: boolean;
  disableExpirationCheckbox: boolean;
  hostUptimeWarnings?: {
    enabledHoursCount: number;
    warnings: string[];
  };
  instanceTypes: string[];
  myPublicKeys: MyPublicKeysQuery["myPublicKeys"];
  noExpirationCheckboxTooltip: string;
  permanentlyExempt: boolean;
  timeZone: string;
  volumes: MyVolumesQuery["myVolumes"];
}

export const getFormSchema = ({
  canEditInstanceType,
  canEditRdpPassword,
  canEditSshKeys,
  disableExpirationCheckbox,
  hostUptimeWarnings,
  instanceTypes,
  myPublicKeys,
  noExpirationCheckboxTooltip,
  permanentlyExempt,
  timeZone,
  volumes,
}: Props): ReturnType<GetFormSchema> => {
  const expirationDetails = getExpirationDetailsSchema({
    disableExpirationCheckbox,
    hostUptimeWarnings,
    isEditModal: true,
    noExpirationCheckboxTooltip,
    permanentlyExempt,
    timeZone,
  });
  const publicKeys = getPublicKeySchema({
    canEditSshKeys,
    myPublicKeys,
    required: false,
  });

  return {
    fields: {},
    schema: {
      properties: {
        hostName: {
          default: "",
          title: "Edit Host Name",
          type: "string",
        },
        instanceType: {
          default: "",
          oneOf: [
            {
              enum: [""],
              title: "Select instance type…",
              type: "string" as const,
            },
            ...instanceTypes.map((it) => ({
              enum: [it],
              title: it,
              type: "string" as const,
            })),
          ],
          title: "Change Instance Type",
          type: "string" as const,
        },
        volume: {
          default: "",
          oneOf: [
            {
              enum: [""],
              title: "Select volume…",
              type: "string" as const,
            },
            ...volumes.map((v) => ({
              enum: [v.id],
              title: `(${v.size}GB) ${v.displayName || v.id}`,
              type: "string" as const,
            })),
          ],
          title: "Add Volume",
          type: "string" as const,
        },
        ...(canEditRdpPassword && {
          rdpPassword: {
            default: "",
            title: "Set New RDP Password",
            type: "string",
          },
        }),
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        expirationDetails: expirationDetails.schema,
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        publicKeySection: publicKeys.schema,
        userTags: {
          items: {
            properties: {
              key: {
                default: "",
                title: "Key",
                type: "string" as const,
              },
              value: {
                default: "",
                title: "Value",
                type: "string" as const,
              },
            },
            type: "object" as const,
          },
          title: "",
          type: "array" as const,
        },
      },
      type: "object" as const,
    },
    uiSchema: {
      expirationDetails: {
        ...expirationDetails.uiSchema,
        "ui:elementWrapperCSS": css`
          margin-bottom: ${size.s};
        `,
      },
      instanceType: {
        "ui:allowDeselect": false,
        "ui:description": !canEditInstanceType
          ? "Instance type can only be changed when the host is stopped."
          : "",
        "ui:disabled": !canEditInstanceType,
      },
      publicKeySection: publicKeys.uiSchema,
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
        "ui:inputType": "password",
      },
      userTags: {
        items: {
          "ui:elementWrapperCSS": css`
            display: flex;
            gap: ${size.s};
          `,
        },
        "ui:addButtonText": "Add Tag",
        "ui:descriptionNode": (
          <Label htmlFor="root_userTags">Add User Tags</Label>
        ),
        "ui:orderable": false,
      },
      volume: {
        "ui:allowDeselect": false,
        "ui:description": volumes.length === 0 ? "No volumes available." : "",
        "ui:disabled": volumes.length === 0,
      },
    },
  };
};
