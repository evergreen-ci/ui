import { useApolloClient } from "@apollo/client/react";
import { toast } from "@via-ds/components/toast";
import {
  UserSettingsQuery,
  UserSettingsQueryVariables,
} from "gql/generated/types";
import { USER_SETTINGS } from "gql/queries";
import {
  CreatedNotificationAction,
  NotificationModalSource,
  ViewedRestartNotificationPromptAction,
} from "types/subscription";
import { RestartToastMessage, RestartToastMessageProps } from ".";

type RestartToastAction =
  | ViewedRestartNotificationPromptAction
  | CreatedNotificationAction;

interface UseRestartSuccessToastOptions extends Pick<
  RestartToastMessageProps,
  "resourceId" | "type"
> {
  sendEvent: (action: RestartToastAction) => void;
}

/**
 * useRestartSuccessToast returns a function that dispatches the restart success toast with a shortcut to Slack the
 * user on the outcome. The shortcut appears only when the user has a Slack username.
 * @param options - the resource being restarted and the analytics sender
 * @param options.resourceId - the ID of the resource being restarted
 * @param options.sendEvent - sends the toast's analytics events
 * @param options.type - the type of resource being restarted
 * @returns a function that dispatches the success toast with the given message
 */
export const useRestartSuccessToast = ({
  resourceId,
  sendEvent,
  type,
}: UseRestartSuccessToastOptions) => {
  const client = useApolloClient();
  const onSubscribe: RestartToastMessageProps["onSubscribe"] = (subscription) =>
    sendEvent({
      name: "Created notification",
      "notification.source": NotificationModalSource.RestartToast,
      "slack_username.saved": false,
      "subscription.changed_initial_selection": false,
      "subscription.type": subscription.subscriber.type || "",
      "subscription.trigger": subscription.trigger || "",
    });

  return async (message: string) => {
    // Fetch again in case the user changed their Slack username in another tab.
    const slackUsername = await client
      .query<UserSettingsQuery, UserSettingsQueryVariables>({
        query: USER_SETTINGS,
        fetchPolicy: "network-only",
      })
      .then(({ data }) => data?.user?.settings?.slackUsername)
      .catch(() => undefined);

    sendEvent({ name: "Viewed restart notification prompt" });
    toast.success(message, {
      ...(slackUsername && {
        actionElement: (
          <RestartToastMessage
            onError={(errorMessage) => toast.error(errorMessage)}
            onSubscribe={onSubscribe}
            resourceId={resourceId}
            slackUsername={slackUsername}
            type={type}
          />
        ),
      }),
      duration: 30_000,
      isDismissible: true,
    });
  };
};
