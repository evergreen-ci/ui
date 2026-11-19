import { useMutation } from "@apollo/client/react";
import Popconfirm from "@evg-ui/lib/components/Popconfirm";
import { useToastContext } from "@evg-ui/lib/context/toast";
import {
  ScheduleUndispatchedBaseTasksMutation,
  ScheduleUndispatchedBaseTasksMutationVariables,
} from "gql/generated/types";
import { SCHEDULE_UNDISPATCHED_BASE_TASKS } from "gql/mutations";

interface Props {
  open: boolean;
  refEl: React.RefObject<HTMLElement | null>;
  setOpen: (open: boolean) => void;
  versionId: string;
}

export const ScheduleUndispatchedBaseTasksPopconfirm: React.FC<Props> = ({
  open,
  refEl,
  setOpen,
  versionId,
}) => {
  const dispatchToast = useToastContext();

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
    <Popconfirm
      data-testid="schedule-undispatched-base-popconfirm"
      onConfirm={onConfirm}
      open={open}
      refEl={refEl}
      setOpen={setOpen}
      side="left"
    >
      Are you sure you want to schedule all the undispatched base tasks for this
      patch&apos;s failing tasks?
    </Popconfirm>
  );
};
