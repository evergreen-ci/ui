import { useMemo, useState } from "react";
import { useMutation } from "@apollo/client/react";
import { css } from "@emotion/react";
import { Button, Variant } from "@leafygreen-ui/button";
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
      refetchQueries: ["UserSettings"],
      variables,
    });
  };

  const initialState = useMemo(
    () => ({
      notifications,
      slackMemberId,
      slackUsername,
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
    enum: ["email"],
    title: "Email",
    type: "string" as const,
  },
  {
    enum: ["slack"],
    title: "Slack",
    type: "string" as const,
  },
  {
    enum: [""],
    title: "None",
    type: "string" as const,
  },
];

const schema = {
  properties: {
    notifications: {
      properties: {
        buildBreak: {
          oneOf: notificationOptions,
          title: notificationFields.buildBreak,
          type: "string" as const,
        },
        patchFinish: {
          oneOf: notificationOptions,
          title: notificationFields.patchFinish,
          type: "string" as const,
        },
        patchFirstFailure: {
          oneOf: notificationOptions,
          title: notificationFields.patchFirstFailure,
          type: "string" as const,
        },
        spawnHostExpiration: {
          oneOf: notificationOptions,
          title: notificationFields.spawnHostExpiration,
          type: "string" as const,
        },
        spawnHostOutcome: {
          oneOf: notificationOptions,
          title: notificationFields.spawnHostOutcome,
          type: "string" as const,
        },
      },
      title: "Notifications",
      type: "object" as const,
    },
    slackMemberId: {
      title: "Slack Member ID",
      type: "string" as const,
    },
    slackUsername: {
      title: "Slack Username",
      type: "string" as const,
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
  "ui:elementWrapperCSS": css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${size.xs};
    margin-bottom: 0;
  `,
  "ui:inline": true,
  "ui:widget": "radio",
};

const uiSchema = {
  notifications: {
    buildBreak: radioUISchema,
    patchFinish: radioUISchema,
    patchFirstFailure: radioUISchema,
    spawnHostExpiration: radioUISchema,
    spawnHostOutcome: radioUISchema,
    "ui:fieldCss": zebraCSS,
  },
  slackMemberId: {
    "ui:data-cy": "slack-member-id-field",
    "ui:description":
      "Click on the three dots next to 'set a status' in your Slack profile, and then 'Copy member ID'.",
    "ui:placeholder": "e.g. U12345678",
  },
  slackUsername: {
    "ui:data-cy": "slack-username-field",
    "ui:placeholder": "e.g. john.smith",
  },
};
