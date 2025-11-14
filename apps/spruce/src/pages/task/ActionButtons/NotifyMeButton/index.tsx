import { useState } from "react";
import Button, { Size as ButtonSize } from "@leafygreen-ui/button";
import { useTaskAnalytics } from "analytics";
import { TaskNotificationModal } from "./TaskNotificationModal";

interface Props {
  buttonSize?: ButtonSize;
  taskId: string;
}

export const NotifyMeButton: React.FC<Props> = ({
  buttonSize = ButtonSize.Small,
  taskId,
}) => {
  const taskAnalytics = useTaskAnalytics();
  const [isVisibleModal, setIsVisibleModal] = useState(false);

  return (
    <>
      <Button
        key="notifications"
        data-cy="notify-task"
        onClick={() => {
          taskAnalytics.sendEvent({ name: "Viewed notification modal" });
          setIsVisibleModal(true);
        }}
        size={buttonSize}
      >
        Notify me
      </Button>
      <TaskNotificationModal
        onCancel={() => setIsVisibleModal(false)}
        taskId={taskId}
        visible={isVisibleModal}
      />
    </>
  );
};
