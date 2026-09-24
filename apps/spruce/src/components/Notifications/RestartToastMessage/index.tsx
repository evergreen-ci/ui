import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import {
  SaveSubscriptionForUserMutation,
  SaveSubscriptionForUserMutationVariables,
} from "gql/generated/types";
import { SAVE_SUBSCRIPTION } from "gql/mutations";
import { getSlackOnOutcomeSubscription } from "../utils";
import styles from "./index.module.css";

type Subscription = SaveSubscriptionForUserMutationVariables["subscription"];

export interface RestartToastMessageProps {
  message: string;
  // Toast content renders outside the toast context, so errors are reported through the dispatcher's context.
  onError: (message: string) => void;
  onSubscribe: (subscription: Subscription) => void;
  resourceId: string;
  slackUsername: string;
  type: "task" | "version";
}

// Owns the subscription itself because the component that dispatched the toast may unmount after the restart.
export const RestartToastMessage: React.FC<RestartToastMessageProps> = ({
  message,
  onError,
  onSubscribe,
  resourceId,
  slackUsername,
  type,
}) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [saveSubscription, { loading }] = useMutation<
    SaveSubscriptionForUserMutation,
    SaveSubscriptionForUserMutationVariables
  >(SAVE_SUBSCRIPTION, {
    onCompleted: () => setIsSubscribed(true),
    onError: (err) => {
      onError(`Error adding your subscription: '${err.message}'`);
    },
  });

  const onClick = () => {
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
      {message}
      {isSubscribed ? (
        <span className={styles.subscribed}>Subscribed.</span>
      ) : (
        <button
          className={styles.notifyButton}
          data-testid="restart-toast-notify-button"
          disabled={loading}
          onClick={onClick}
          type="button"
        >
          Slack me on outcome
        </button>
      )}
    </span>
  );
};
