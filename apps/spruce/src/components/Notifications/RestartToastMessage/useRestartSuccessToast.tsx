import { toast } from "@via-ds/components/toast";
import {
  CreatedNotificationAction,
  NotificationModalSource,
  ViewedNotificationModalAction,
  ViewedRestartNotificationPromptAction,
  subscriptionMethods,
} from "types/subscription";
import { useNotificationModal } from "../NotificationModalContext";
import { getResourceTriggers } from "../utils";
import { RestartToastMessage, RestartToastMessageProps } from ".";

type RestartToastAction =
  | ViewedRestartNotificationPromptAction
  | ViewedNotificationModalAction
  | CreatedNotificationAction;

interface UseRestartSuccessToastOptions extends Pick<
  RestartToastMessageProps,
  "resourceId" | "type"
> {
  sendEvent: (action: RestartToastAction) => void;
}

/**
 * useRestartSuccessToast returns a function that dispatches the restart success toast with a shortcut to Slack the
 * user on the outcome. Users without a Slack username are sent to the notification modal to enter one.
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
  const { openNotificationModal } = useNotificationModal();

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
    sendEvent({ name: "Viewed restart notification prompt" });
    toast.success(message, {
      actionElement: (
        <RestartToastMessage
          onError={(errorMessage) => toast.error(errorMessage)}
          onOpenModal={() => {
            sendEvent({
              name: "Viewed notification modal",
              "notification.source": NotificationModalSource.RestartToast,
            });
            openNotificationModal({
              "data-testid": "restart-notification-modal",
              ignoreSavedSelections: true,
              resourceId,
              sendEvent,
              source: NotificationModalSource.RestartToast,
              subscriptionMethods,
              triggers: getResourceTriggers(type),
              type,
            });
          }}
          onSubscribe={onSubscribe}
          resourceId={resourceId}
          type={type}
        />
      ),
      duration: 30_000,
      isDismissible: true,
    });
  };
};
