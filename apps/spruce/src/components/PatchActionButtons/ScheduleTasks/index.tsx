import { useState } from "react";
import Button from "@leafygreen-ui/button";
import { useVersionAnalytics } from "analytics";
import { DropdownItem } from "components/ButtonDropdown";
import { ScheduleTasksModal } from "components/ScheduleTasksModal";

interface ScheduleTasksProps {
  versionId: string;
  isButton?: boolean;
  disabled?: boolean;
}
export const ScheduleTasks: React.FC<ScheduleTasksProps> = ({
  disabled = false,
  isButton,
  versionId,
}) => {
  const [open, setOpen] = useState(false);
  const { sendEvent } = useVersionAnalytics(versionId);
  const props = {
    onClick: () => {
      sendEvent({ name: "Viewed schedule tasks modal" });
      setOpen(true);
    },
    "data-cy": "schedule-patch",
  };

  const modalOpenerComp = isButton ? (
    <Button disabled={disabled} size="small" {...props}>
      Schedule
    </Button>
  ) : (
    <DropdownItem disabled={disabled} {...props}>
      Schedule
    </DropdownItem>
  );
  return (
    <>
      {modalOpenerComp}
      <ScheduleTasksModal open={open} setOpen={setOpen} versionId={versionId} />
    </>
  );
};
