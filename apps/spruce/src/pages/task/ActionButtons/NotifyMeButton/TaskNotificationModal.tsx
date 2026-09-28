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
      sendEvent={taskAnalytics.sendEvent}
      source={source}
      subscriptionMethods={taskSubscriptionMethods}
      triggers={taskTriggers}
      type="task"
      visible={visible}
    />
  );
};
