import { toast } from "@via-ds/components/toast";
import { useUserSettings } from "hooks/useUserSettings";
import {
  CreatedNotificationAction,
  NotificationModalSource,
} from "types/subscription";
import { RestartToastMessage, RestartToastMessageProps } from ".";

interface UseSuccessToastWithNotifyOptions extends Pick<
  RestartToastMessageProps,
  "resourceId" | "type"
> {
  sendEvent: (action: CreatedNotificationAction) => void;
}

/**
 * useSuccessToastWithNotify returns a function that dispatches a success toast with a shortcut to Slack the
 * user on the outcome. The shortcut appears only when the user has a Slack username.
 * @param options - the resource being restarted and the analytics sender
 * @param options.resourceId - the ID of the resource being restarted
 * @param options.sendEvent - sends the toast's analytics events
 * @param options.type - the type of resource being restarted
 * @returns a function that dispatches the success toast with the given message
 */
export const useSuccessToastWithNotify = ({
  resourceId,
  sendEvent,
  type,
}: UseSuccessToastWithNotifyOptions) => {
  const { userSettings } = useUserSettings();
  const { slackUsername } = userSettings;
  const onSubscribe: RestartToastMessageProps["onSubscribe"] = (subscription) =>
    sendEvent({
      name: "Created notification",
      "notification.source": NotificationModalSource.RestartToast,
      "slack_username.saved": false,
      "subscription.changed_initial_selection": false,
      "subscription.type": subscription.subscriber.type || "",
      "subscription.trigger": subscription.trigger || "",
    });

  return (message: string) => {
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
