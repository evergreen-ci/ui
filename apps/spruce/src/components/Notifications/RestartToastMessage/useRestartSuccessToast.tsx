import { useToastContext } from "@evg-ui/lib/context/toast";
import { taskTriggers, versionTriggers } from "constants/triggers";
import {
  NotificationModalSource,
  subscriptionMethods,
} from "types/subscription";
import { NotificationModalProps } from "..";
import { useNotificationModal } from "../NotificationModalContext";
import { RestartToastMessage, RestartToastMessageProps } from ".";

type RestartToastAction =
  | { name: "Viewed restart notification prompt" }
  | {
      name: "Created notification";
      "notification.source": NotificationModalSource;
      "subscription.changed_initial_selection": boolean;
      "subscription.type": string;
      "subscription.trigger": string;
    };

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
  const dispatchToast = useToastContext();
  const { openNotificationModal } = useNotificationModal();

  const onSubscribe: NotificationModalProps["sendAnalyticsEvent"] = (
    subscription,
    { changedInitialSelection },
  ) =>
    sendEvent({
      name: "Created notification",
      "notification.source": NotificationModalSource.RestartToast,
      "subscription.changed_initial_selection": changedInitialSelection,
      "subscription.type": subscription.subscriber.type || "",
      "subscription.trigger": subscription.trigger || "",
    });

  return (message: string) => {
    sendEvent({ name: "Viewed restart notification prompt" });
    dispatchToast.success(
      <RestartToastMessage
        message={message}
        onError={(errorMessage) => dispatchToast.error(errorMessage)}
        onOpenModal={() =>
          openNotificationModal({
            "data-testid": "restart-notification-modal",
            ignoreSavedSelections: true,
            resourceId,
            sendAnalyticsEvent: onSubscribe,
            subscriptionMethods,
            triggers: type === "task" ? taskTriggers : versionTriggers,
            type,
          })
        }
        onSubscribe={(subscription) =>
          onSubscribe(subscription, { changedInitialSelection: false })
        }
        resourceId={resourceId}
        type={type}
      />,
    );
  };
};
