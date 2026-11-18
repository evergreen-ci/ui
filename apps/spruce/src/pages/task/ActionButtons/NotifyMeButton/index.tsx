import { useState } from "react";
import { Button, Size as ButtonSize } from "@leafygreen-ui/button";
import { useTaskAnalytics } from "analytics";
import { NotificationModalSource } from "types/subscription";
import { TaskNotificationModal } from "./TaskNotificationModal";

interface Props {
  buttonSize?: ButtonSize;
  source?: NotificationModalSource;
  taskId: string;
}

export const NotifyMeButton: React.FC<Props> = ({
  buttonSize = ButtonSize.Small,
  source = NotificationModalSource.NotifyMeButton,
  taskId,
}) => {
  const taskAnalytics = useTaskAnalytics();
  const [isVisibleModal, setIsVisibleModal] = useState(false);

  return (
    <>
      <Button
        key="notifications"
        data-testid="notify-task"
        onClick={() => {
          taskAnalytics.sendEvent({
            name: "Viewed notification modal",
            "notification.source": source,
          });
          setIsVisibleModal(true);
        }}
        size={buttonSize}
      >
        Notify me
      </Button>
      <TaskNotificationModal
        onCancel={() => setIsVisibleModal(false)}
        source={source}
        taskId={taskId}
        visible={isVisibleModal}
      />
    </>
  );
};
