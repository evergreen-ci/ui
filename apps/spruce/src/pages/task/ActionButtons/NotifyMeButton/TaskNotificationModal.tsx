import { useTaskAnalytics } from "analytics";
import { NotificationModal } from "components/Notifications";
import { taskTriggers } from "constants/triggers";
import {
  NotificationModalSource,
  subscriptionMethods as taskSubscriptionMethods,
} from "types/subscription";

interface ModalProps {
  onCancel: () => void;
  source: NotificationModalSource;
  taskId: string;
  visible: boolean;
}

export const TaskNotificationModal: React.FC<ModalProps> = ({
  onCancel,
  source,
  taskId,
  visible,
}) => {
  const taskAnalytics = useTaskAnalytics();

  return (
    <NotificationModal
      data-testid="task-notification-modal"
      onCancel={onCancel}
      resourceId={taskId}
      sendAnalyticsEvent={(subscription, { changedInitialSelection }) =>
        taskAnalytics.sendEvent({
          name: "Created notification",
          "notification.source": source,
          "subscription.changed_initial_selection": changedInitialSelection,
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
