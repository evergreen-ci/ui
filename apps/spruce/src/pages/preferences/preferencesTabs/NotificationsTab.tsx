import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Button, { Variant } from "@leafygreen-ui/button";
import TextInput from "@leafygreen-ui/text-input";
import { Skeleton } from "antd";
// @ts-expect-error: FIXME. This comment was added by an automated script.
import isEqual from "lodash.isequal";
import { size } from "@evg-ui/lib/constants/tokens";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { usePreferencesAnalytics } from "analytics";
import { SettingsCard } from "components/SettingsCard";
import {
  UpdateUserSettingsMutation,
  UpdateUserSettingsMutationVariables,
} from "gql/generated/types";
import { UPDATE_USER_SETTINGS } from "gql/mutations";
import { useUserSettings } from "hooks";
import { string } from "utils";
import { reportError } from "utils/errorReporting";
import { NotificationField } from "./notificationTab/NotificationField";
import { UserSubscriptions } from "./notificationTab/UserSubscriptions";

const { omitTypename } = string;

export const NotificationsTab: React.FC = () => {
  const dispatchToast = useToastContext();
  const { loading, userSettings } = useUserSettings();
  const { notifications, slackMemberId, slackUsername } = userSettings ?? {};
  const [slackUsernameField, setSlackUsernameField] = useState(slackUsername);
  const [slackMemberIdField, setSlackMemberIdField] = useState(slackMemberId);
  const [notificationStatus, setNotificationStatus] = useState(notifications);
  const { sendEvent } = usePreferencesAnalytics();
  // update state from query
  useEffect(() => {
    setSlackUsernameField(slackUsername);
    setSlackMemberIdField(slackMemberId);
    setNotificationStatus(notifications);
  }, [slackUsername, slackMemberId, notifications]);

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

  if (loading) {
    return <Skeleton active />;
  }

  if (!notificationStatus) {
    return null;
  }

  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const handleSave = async (e): Promise<void> => {
    e.preventDefault();

    const variables = {
      userSettings: {
        slackUsername: slackUsernameField,
        slackMemberId: slackMemberIdField,
        notifications: omitTypename(notificationStatus),
      },
    };
    sendEvent({
      name: "Saved notification preferences",
    });
    try {
      await updateUserSettings({
        variables,
        refetchQueries: ["UserSettings"],
      });
    } catch (err) {
      reportError(new Error(`Failed to save notification preferences: ${err}`));
    }
  };

  const hasFieldUpdates =
    slackUsername !== slackUsernameField ||
    slackMemberId !== slackMemberIdField ||
    !isEqual(notificationStatus, notifications);

  const newPayload = omitTypename(notificationStatus);
  return (
    <>
      <SettingsCard>
        <StyledTextInput
          data-cy="slack-username-field"
          label="Slack Username"
          onChange={handleFieldUpdate(setSlackUsernameField)}
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          value={slackUsernameField}
        />
        <StyledTextInput
          data-cy="slack-member-id-field"
          description="Click on the three dots next to 'set a status' in your Slack profile, and then 'Copy member ID'."
          label="Slack Member ID"
          onChange={handleFieldUpdate(setSlackMemberIdField)}
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          value={slackMemberIdField}
        />
        <NotificationField
          notifications={newPayload}
          notificationStatus={notificationStatus}
          setNotificationStatus={setNotificationStatus}
        />
        <Button
          data-cy="save-profile-changes-button"
          disabled={!hasFieldUpdates || updateLoading}
          onClick={handleSave}
          variant={Variant.Primary}
        >
          Save changes
        </Button>
      </SettingsCard>
      <UserSubscriptions />
    </>
  );
};

// @ts-expect-error: FIXME. This comment was added by an automated script.
const handleFieldUpdate = (stateUpdate) => (e) => {
  if (typeof e === "string") {
    stateUpdate(e); // Antd select just passes in the value string instead of an event
  } else {
    stateUpdate(e.target.value);
  }
};

const StyledTextInput = styled(TextInput)`
  margin-bottom: ${size.m};
  width: 50%;
`;
