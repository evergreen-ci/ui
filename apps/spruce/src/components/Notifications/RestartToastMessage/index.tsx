import { useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import { Button } from "@via-ds/components/button";
import {
  SaveSubscriptionForUserMutation,
  SaveSubscriptionForUserMutationVariables,
  UserSettingsQuery,
  UserSettingsQueryVariables,
} from "gql/generated/types";
import { SAVE_SUBSCRIPTION } from "gql/mutations";
import { USER_SETTINGS } from "gql/queries";
import { getSlackOnOutcomeSubscription } from "../utils";

type Subscription = SaveSubscriptionForUserMutationVariables["subscription"];

export interface RestartToastMessageProps {
  onError: (message: string) => void;
  onOpenModal: () => void;
  onSubscribe: (subscription: Subscription) => void;
  resourceId: string;
  type: "task" | "version";
}

// Owns the subscription itself because the component that dispatched the toast may unmount after the restart.
export const RestartToastMessage: React.FC<RestartToastMessageProps> = ({
  onError,
  onOpenModal,
  onSubscribe,
  resourceId,
  type,
}) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  // The user may have saved a Slack username in another tab since the toast appeared.
  const [fetchUserSettings, { loading: userSettingsLoading }] = useLazyQuery<
    UserSettingsQuery,
    UserSettingsQueryVariables
  >(USER_SETTINGS, { fetchPolicy: "network-only" });
  const [saveSubscription, { loading: saveLoading }] = useMutation<
    SaveSubscriptionForUserMutation,
    SaveSubscriptionForUserMutationVariables
  >(SAVE_SUBSCRIPTION, {
    onCompleted: () => setIsSubscribed(true),
    onError: (err) =>
      onError(`Error adding your subscription: '${err.message}'`),
  });

  const onClick = async () => {
    const slackUsername = await fetchUserSettings()
      .then(({ data }) => data?.user?.settings?.slackUsername)
      .catch(() => undefined);
    // Without a Slack username there is no target to subscribe in one click, so the modal asks for one.
    if (!slackUsername) {
      onOpenModal();
      return;
    }
    const subscription = getSlackOnOutcomeSubscription(
      type,
      resourceId,
      slackUsername,
    );
    saveSubscription({ variables: { subscription } });
    onSubscribe(subscription);
  };

  return isSubscribed ? (
    <span>✓ Slack notification added.</span>
  ) : (
    <Button
      aria-description="You can also add a notification using Notify Me on the task or version page."
      data-testid="restart-toast-notify-button"
      isDisabled={userSettingsLoading || saveLoading}
      onPress={onClick}
    >
      Slack when finished
    </Button>
  );
};
