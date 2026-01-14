import { useMemo, useState } from "react";
import { useMutation } from "@apollo/client/react";
import { css } from "@emotion/react";
import Button, { Variant } from "@leafygreen-ui/button";
import { palette } from "@leafygreen-ui/palette";
import { AjvError } from "@rjsf/core";
import isEqual from "lodash.isequal";
import { size } from "@evg-ui/lib/constants/tokens";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { usePreferencesAnalytics } from "analytics";
import { SpruceForm } from "components/SpruceForm";
import { notificationFields } from "constants/subscription";
import {
  Notifications,
  UpdateUserSettingsMutation,
  UpdateUserSettingsMutationVariables,
} from "gql/generated/types";
import { UPDATE_USER_SETTINGS } from "gql/mutations";

interface SettingsProps {
  notifications: Notifications;
  slackMemberId: string;
  slackUsername: string;
}

export const Settings: React.FC<SettingsProps> = ({
  notifications,
  slackMemberId,
  slackUsername,
}) => {
  const dispatchToast = useToastContext();
  const { sendEvent } = usePreferencesAnalytics();
  const [formErrors, setFormErrors] = useState<AjvError[]>([]);

  const [updateUserSettings, { loading: updateLoading }] = useMutation<
    UpdateUserSettingsMutation,
    UpdateUserSettingsMutationVariables
  >(UPDATE_USER_SETTINGS, {
    onCompleted: () => {
      dispatchToast.success("Your changes have been saved.");
    },
    onError: (err) => {
      dispatchToast.error(`Error while saving settings: '${err.message}'`);
    },
  });

  const handleSave = () => {
    const variables = { userSettings: formState };
    sendEvent({
      name: "Saved notification preferences",
    });
    updateUserSettings({
      variables,
      refetchQueries: ["UserSettings"],
    });
  };

  const initialState = useMemo(
    () => ({
      slackUsername,
      slackMemberId,
      notifications,
    }),
    [notifications, slackMemberId, slackUsername],
  );

  const [formState, setFormState] = useState<FormState>(initialState);

  const hasChanges =
    slackUsername !== formState.slackUsername ||
    slackMemberId !== formState.slackMemberId ||
    !isEqual(formState.notifications, notifications);

  return (
    <>
      <SpruceForm
        formData={formState}
        onChange={({ errors, formData }) => {
          setFormState(formData);
          setFormErrors(errors);
        }}
        schema={schema}
        uiSchema={uiSchema}
      />
      <Button
        data-cy="save-profile-changes-button"
        disabled={formErrors.length > 0 || !hasChanges || updateLoading}
        onClick={handleSave}
        variant={Variant.Primary}
      >
        Save changes
      </Button>
    </>
  );
};

type FormState = {
  slackUsername: string;
  slackMemberId: string;
  notifications: Notifications;
};

const notificationOptions = [
  {
    type: "string" as const,
    title: "Email",
    enum: ["email"],
  },
  {
    type: "string" as const,
    title: "Slack",
    enum: ["slack"],
  },
  {
    type: "string" as const,
    title: "None",
    enum: [""],
  },
];

const schema = {
  properties: {
    slackUsername: {
      type: "string" as const,
      title: "Slack Username",
    },
    slackMemberId: {
      type: "string" as const,
      title: "Slack Member ID",
    },
    notifications: {
      type: "object" as const,
      title: "Notifications",
      properties: {
        buildBreak: {
          type: "string" as const,
          title: notificationFields.buildBreak,
          oneOf: notificationOptions,
        },
        patchFinish: {
          type: "string" as const,
          title: notificationFields.patchFinish,
          oneOf: notificationOptions,
        },
        patchFirstFailure: {
          type: "string" as const,
          title: notificationFields.patchFirstFailure,
          oneOf: notificationOptions,
        },
        spawnHostExpiration: {
          type: "string" as const,
          title: notificationFields.spawnHostExpiration,
          oneOf: notificationOptions,
        },
        spawnHostOutcome: {
          type: "string" as const,
          title: notificationFields.spawnHostOutcome,
          oneOf: notificationOptions,
        },
      },
    },
  },
};

const zebraCSS = css`
  width: 450px;
  > fieldset > div {
    :nth-child(even) {
      background-color: ${palette.gray.light3};
    }
    :not(:last-child) {
      border-bottom: 1px solid ${palette.gray.light2};
    }
  }
  margin-bottom: ${size.s};
`;

const radioUISchema = {
  "ui:widget": "radio",
  "ui:inline": true,
  "ui:elementWrapperCSS": css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${size.xs};
    margin-bottom: 0;
  `,
};

const uiSchema = {
  slackUsername: {
    "ui:placeholder": "e.g. john.smith",
    "ui:data-cy": "slack-username-field",
  },
  slackMemberId: {
    "ui:description":
      "Click on the three dots next to 'set a status' in your Slack profile, and then 'Copy member ID'.",
    "ui:placeholder": "e.g. U12345678",
    "ui:data-cy": "slack-member-id-field",
  },
  notifications: {
    "ui:fieldCss": zebraCSS,
    buildBreak: radioUISchema,
    patchFinish: radioUISchema,
    patchFirstFailure: radioUISchema,
    spawnHostExpiration: radioUISchema,
    spawnHostOutcome: radioUISchema,
  },
};
