import { useState } from "react";
import { Button } from "@leafygreen-ui/button";
import { useVersionAnalytics } from "analytics";
import { ScheduleTasksModal } from "components/ScheduleTasksModal";

interface ScheduleTasksProps {
  versionId: string;
  disabled?: boolean;
}
export const ScheduleTasks: React.FC<ScheduleTasksProps> = ({
  disabled = false,
  versionId,
}) => {
  const [open, setOpen] = useState(false);
  const { sendEvent } = useVersionAnalytics(versionId);

  return (
    <>
      <Button
        data-testid="schedule-patch"
        disabled={disabled}
        onClick={() => {
          sendEvent({ name: "Viewed schedule tasks modal" });
          setOpen(true);
        }}
        size="small"
      >
        Schedule
      </Button>
      <ScheduleTasksModal open={open} setOpen={setOpen} versionId={versionId} />
    </>
  );
};
