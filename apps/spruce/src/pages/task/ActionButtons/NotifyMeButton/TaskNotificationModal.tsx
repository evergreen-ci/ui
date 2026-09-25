import { useTaskAnalytics } from "analytics";
import { NotificationModal } from "components/Notifications";
import { getCreatedNotificationEvent } from "components/Notifications/utils";
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
      sendAnalyticsEvent={(subscription, details) =>
        taskAnalytics.sendEvent(
          getCreatedNotificationEvent(source, subscription, details),
        )
      }
      subscriptionMethods={taskSubscriptionMethods}
      triggers={taskTriggers}
      type="task"
      visible={visible}
    />
  );
};
