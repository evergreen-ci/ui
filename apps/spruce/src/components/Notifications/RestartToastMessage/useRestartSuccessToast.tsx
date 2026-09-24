import { useToastContext } from "@evg-ui/lib/context/toast";
import { taskTriggers, versionTriggers } from "constants/triggers";
import { useUserSettings } from "hooks/useUserSettings";
import { subscriptionMethods } from "types/subscription";
import { NotificationModalProps } from "..";
import { useNotificationModal } from "../NotificationModalContext";
import { RestartToastMessage, RestartToastMessageProps } from ".";

interface UseRestartSuccessToastOptions extends Pick<
  RestartToastMessageProps,
  "resourceId" | "type"
> {
  onPromptShown: () => void;
  onSubscribe: NotificationModalProps["sendAnalyticsEvent"];
}

/**
 * useRestartSuccessToast returns a function that dispatches the restart success toast with a shortcut to Slack the
 * user on the outcome. Users without a Slack username are sent to the notification modal to enter one.
 * @param options - the resource being restarted and analytics callbacks
 * @param options.onPromptShown - called when the toast offers the Slack shortcut
 * @param options.onSubscribe - called when the user subscribes from the toast
 * @param options.resourceId - the ID of the resource being restarted
 * @param options.type - the type of resource being restarted
 * @returns a function that dispatches the success toast with the given message
 */
export const useRestartSuccessToast = ({
  onPromptShown,
  onSubscribe,
  resourceId,
  type,
}: UseRestartSuccessToastOptions) => {
  const dispatchToast = useToastContext();
  const { openNotificationModal } = useNotificationModal();
  const { userSettings } = useUserSettings();
  const { slackUsername } = userSettings;

  return (message: string) => {
    onPromptShown();
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
        slackUsername={slackUsername ?? undefined}
        type={type}
      />,
    );
  };
};
