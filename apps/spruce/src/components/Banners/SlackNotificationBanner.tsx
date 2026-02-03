import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import styled from "@emotion/styled";
import { Banner } from "@leafygreen-ui/banner";
import { palette } from "@leafygreen-ui/palette";
import { TextInput } from "@leafygreen-ui/text-input";
import Cookies from "js-cookie";
import { Popconfirm } from "@evg-ui/lib/components";
import { CharKey, fontSize } from "@evg-ui/lib/constants";
import { useToastContext } from "@evg-ui/lib/context";
import { SLACK_NOTIFICATION_BANNER } from "constants/cookies";
import {
  UpdateUserSettingsMutation,
  UpdateUserSettingsMutationVariables,
} from "gql/generated/types";
import { UPDATE_USER_SETTINGS } from "gql/mutations";
import { useUserSettings } from "hooks";

const { blue } = palette;

export const SlackNotificationBanner = () => {
  const dispatchToast = useToastContext();

  // UPDATE USER SETTINGS MUTATION
  const [updateUserSettings, { loading: loadingUpdateUserSettings }] =
    useMutation<
      UpdateUserSettingsMutation,
      UpdateUserSettingsMutationVariables
    >(UPDATE_USER_SETTINGS, {
      onCompleted: () => {
        hideBanner();
        dispatchToast.success(
          "You will now receive Slack notifications when your patches fail or succeed",
        );
      },
      onError: (err) => {
        dispatchToast.error(`Error while saving settings: '${err.message}'`);
      },
      refetchQueries: ["UserSettings"],
    });

  const { loading: loadingUserSettings, userSettings } = useUserSettings();
  const { notifications, slackUsername: defaultSlackUsername } =
    userSettings || {};
  const { patchFinish, patchFirstFailure } = notifications || {};

  const [slackUsername, setSlackUsername] = useState(
    () => defaultSlackUsername,
  );

  const hasClosedSlackBanner = () =>
    Boolean(Cookies.get(SLACK_NOTIFICATION_BANNER));

  const [hasClosedBanner, setHasClosedBanner] = useState(hasClosedSlackBanner);

  const hideBanner = () => {
    Cookies.set(SLACK_NOTIFICATION_BANNER, "true", { expires: 60 });
    setHasClosedBanner(true);
  };

  const saveNotificationSettings = () => {
    updateUserSettings({
      variables: {
        userSettings: {
          slackUsername,
          notifications: {
            patchFinish: "slack",
            patchFirstFailure: "slack",
          },
        },
      },
    });
    hideBanner();
  };

  // let's only show the banner if we have data for the user settings and the user has not closed the banner
  // this prevents a flicker of the banner on initial load
  const hasSetNotifications =
    !notifications &&
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    (isNotificationSet(patchFirstFailure) || isNotificationSet(patchFinish));

  const shouldShowSlackBanner =
    !loadingUserSettings &&
    !defaultSlackUsername &&
    !hasClosedBanner &&
    !hasSetNotifications;

  return shouldShowSlackBanner ? (
    <Banner
      data-cy="slack-notification-banner"
      dismissible
      onClose={hideBanner}
      variant="info"
    >
      You can receive a Slack notification when your patch is ready.{" "}
      <Popconfirm
        confirmDisabled={!slackUsername || loadingUpdateUserSettings}
        confirmText="Save"
        onConfirm={() => saveNotificationSettings()}
        trigger={
          <SubscribeButton data-cy="subscribe-to-notifications">
            Subscribe
          </SubscribeButton>
        }
      >
        <TextInput
          autoFocus // eslint-disable-line jsx-a11y/no-autofocus
          data-cy="slack-username-input"
          label="Slack Username"
          onChange={(e) => setSlackUsername(e.target.value)}
          onKeyDown={(e) =>
            e.key === CharKey.Enter && saveNotificationSettings()
          }
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          value={slackUsername}
        />
      </Popconfirm>
    </Banner>
  ) : null;
};

const isNotificationSet = (field: string) =>
  field !== "" && field !== undefined;

const SubscribeButton = styled.span`
  text-decoration: underline;
  text-decoration-color: ${blue.dark2};
  cursor: pointer;
  color: ${blue.dark2};
  font-size: ${fontSize.m};
`;
