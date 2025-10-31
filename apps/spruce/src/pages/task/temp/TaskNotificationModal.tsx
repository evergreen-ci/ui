import { useParams } from "react-router-dom";
import { useTaskAnalytics } from "analytics";
import { NotificationModal } from "components/Notifications";
import { slugs } from "constants/routes";
import { taskTriggers } from "constants/triggers";
import { subscriptionMethods as taskSubscriptionMethods } from "types/subscription";

interface ModalProps {
  visible: boolean;
  onCancel: () => void;
}

export const TaskNotificationModal: React.FC<ModalProps> = ({
  onCancel,
  visible,
}) => {
  const { [slugs.taskId]: taskId } = useParams();
  const taskAnalytics = useTaskAnalytics();

  return (
    <NotificationModal
      data-cy="task-notification-modal"
      onCancel={onCancel}
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      resourceId={taskId}
      sendAnalyticsEvent={(subscription) =>
        taskAnalytics.sendEvent({
          name: "Created notification",
          "subscription.type": subscription.subscriber.type || "",
          "subscription.trigger": subscription.trigger || "",
        })
      }
      subscriptionMethods={taskSubscriptionMethods}
      triggers={taskTriggers}
      type="task"
      visible={visible}
    />
  );
};
