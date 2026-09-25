import { useState } from "react";
import { useLazyQuery } from "@apollo/client/react";
import {
  SaveSubscriptionForUserMutationVariables,
  UserSettingsQuery,
  UserSettingsQueryVariables,
} from "gql/generated/types";
import { USER_SETTINGS } from "gql/queries";
import { useSaveSubscription } from "../useSaveSubscription";
import { getSlackOnOutcomeSubscription } from "../utils";
import styles from "./index.module.css";

type Subscription = SaveSubscriptionForUserMutationVariables["subscription"];

export interface RestartToastMessageProps {
  message: string;
  // Toast content renders outside the toast context, so errors are reported through the dispatcher's context.
  onError: (message: string) => void;
  onOpenModal: () => void;
  onSubscribe: (subscription: Subscription) => void;
  resourceId: string;
  type: "task" | "version";
}

// Owns the subscription itself because the component that dispatched the toast may unmount after the restart.
export const RestartToastMessage: React.FC<RestartToastMessageProps> = ({
  message,
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
  const [saveSubscription, { loading: saveLoading }] = useSaveSubscription({
    onCompleted: () => setIsSubscribed(true),
    onError,
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

  return (
    <span>
      {message}{" "}
      {isSubscribed ? (
        "Subscribed."
      ) : (
        <button
          className={styles.notifyButton}
          data-testid="restart-toast-notify-button"
          disabled={userSettingsLoading || saveLoading}
          onClick={onClick}
          type="button"
        >
          Slack me on outcome
        </button>
      )}
    </span>
  );
};
