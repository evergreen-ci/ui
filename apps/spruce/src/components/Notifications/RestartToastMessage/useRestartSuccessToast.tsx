import { useToastContext } from "@evg-ui/lib/context/toast";
import { useUserSettings } from "hooks/useUserSettings";
import { RestartToastMessage, RestartToastMessageProps } from ".";

interface UseRestartSuccessToastOptions extends Pick<
  RestartToastMessageProps,
  "onSubscribe" | "resourceId" | "type"
> {
  onPromptShown: () => void;
}

/**
 * useRestartSuccessToast returns a function that dispatches the restart success toast, offering to Slack the user
 * on the outcome when they have a Slack username.
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
  const { userSettings } = useUserSettings();
  const { slackUsername } = userSettings;

  return (message: string) => {
    if (!slackUsername) {
      dispatchToast.success(message);
      return;
    }
    onPromptShown();
    dispatchToast.success(
      <RestartToastMessage
        message={message}
        onError={(errorMessage) => dispatchToast.error(errorMessage)}
        onSubscribe={onSubscribe}
        resourceId={resourceId}
        slackUsername={slackUsername}
        type={type}
      />,
    );
  };
};
