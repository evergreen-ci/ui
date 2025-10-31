import { useTaskAnalytics } from "analytics";
import { NotificationModal } from "components/Notifications";
import { taskTriggers } from "constants/triggers";
import { subscriptionMethods as taskSubscriptionMethods } from "types/subscription";

interface ModalProps {
  onCancel: () => void;
  taskId: string;
  visible: boolean;
}

export const TaskNotificationModal: React.FC<ModalProps> = ({
  onCancel,
  taskId,
  visible,
}) => {
  const taskAnalytics = useTaskAnalytics();

  return (
    <NotificationModal
      data-cy="task-notification-modal"
      onCancel={onCancel}
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
