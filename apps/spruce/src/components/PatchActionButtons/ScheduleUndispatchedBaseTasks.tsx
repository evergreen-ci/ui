import { useState, useRef } from "react";
import { useMutation } from "@apollo/client/react";
import { MenuItem } from "@leafygreen-ui/menu";
import Popconfirm from "@evg-ui/lib/components/Popconfirm";
import { useToastContext } from "@evg-ui/lib/context/toast";
import {
  ScheduleUndispatchedBaseTasksMutation,
  ScheduleUndispatchedBaseTasksMutationVariables,
} from "gql/generated/types";
import { SCHEDULE_UNDISPATCHED_BASE_TASKS } from "gql/mutations";

interface Props {
  versionId: string;
  disabled: boolean;
}

export const ScheduleUndispatchedBaseTasks: React.FC<Props> = ({
  disabled,
  versionId,
}) => {
  const dispatchToast = useToastContext();
  const [open, setOpen] = useState(false);
  const menuItemRef = useRef<HTMLDivElement>(null);

  const [scheduleBaseVersionTasks] = useMutation<
    ScheduleUndispatchedBaseTasksMutation,
    ScheduleUndispatchedBaseTasksMutationVariables
  >(SCHEDULE_UNDISPATCHED_BASE_TASKS, {
    onCompleted({ scheduleUndispatchedBaseTasks }) {
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      const successMessage = `Successfully scheduled ${scheduleUndispatchedBaseTasks.length} tasks`;
      dispatchToast.success(successMessage);
    },
    onError({ message }) {
      dispatchToast.error(message);
    },
  });

  const onConfirm = () => {
    scheduleBaseVersionTasks({ variables: { versionId } });
  };

  return (
    <>
      <div ref={menuItemRef}>
        <MenuItem
          active={open}
          disabled={disabled}
          onClick={() => setOpen(!open)}
        >
          Schedule failing base tasks
        </MenuItem>
      </div>
      <Popconfirm
        align="left"
        data-cy="schedule-undispatched-base-popconfirm"
        onConfirm={onConfirm}
        open={open}
        refEl={menuItemRef}
        setOpen={setOpen}
      >
        Are you sure you want to schedule all the undispatched base tasks for
        this patch&apos;s failing tasks?
      </Popconfirm>
    </>
  );
};
