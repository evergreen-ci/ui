import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { Button } from "@via-ds/components/button";
import {
  SaveSubscriptionForUserMutation,
  SaveSubscriptionForUserMutationVariables,
} from "gql/generated/types";
import { SAVE_SUBSCRIPTION } from "gql/mutations";
import { getSlackOnOutcomeSubscription } from "../utils";

type Subscription = SaveSubscriptionForUserMutationVariables["subscription"];

export interface RestartToastMessageProps {
  onError: (message: string) => void;
  onSubscribe: (subscription: Subscription) => void;
  resourceId: string;
  slackUsername: string;
  type: "task" | "version";
}

// Owns the subscription itself because the component that dispatched the toast may unmount after the restart.
export const RestartToastMessage: React.FC<RestartToastMessageProps> = ({
  onError,
  onSubscribe,
  resourceId,
  slackUsername,
  type,
}) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [saveSubscription, { loading: saveLoading }] = useMutation<
    SaveSubscriptionForUserMutation,
    SaveSubscriptionForUserMutationVariables
  >(SAVE_SUBSCRIPTION, {
    onCompleted: () => setIsSubscribed(true),
    onError: (err) =>
      onError(`Error adding your subscription: '${err.message}'`),
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

  if (isSubscribed) {
    return <span>✓ Slack notification added</span>;
  }
  return (
    <Button
      aria-description="You can also add a notification using Notify Me on the task or version page."
      data-testid="restart-toast-notify-button"
      isDisabled={saveLoading}
      onPress={onClick}
    >
      Slack when finished
    </Button>
  );
};
