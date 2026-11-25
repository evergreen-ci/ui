import { useMutation } from "@apollo/client/react";
import Popconfirm from "@evg-ui/lib/components/Popconfirm";
import { useToastContext } from "@evg-ui/lib/context/toast";
import {
  ScheduleUndispatchedBaseTasksMutation,
  ScheduleUndispatchedBaseTasksMutationVariables,
} from "gql/generated/types";
import { SCHEDULE_UNDISPATCHED_BASE_TASKS } from "gql/mutations";
import styles from "./PopconfirmMessage.module.css";

// The mutation lives in a hook so its callbacks survive the popconfirm
// unmounting on confirm.
export const useScheduleUndispatchedBaseTasks = (versionId: string) => {
  const dispatchToast = useToastContext();

  const [scheduleBaseVersionTasks, { loading }] = useMutation<
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

  const schedule = () => {
    scheduleBaseVersionTasks({ variables: { versionId } });
  };

  return { loading, schedule };
};

interface Props {
  onConfirm: () => void;
  open: boolean;
  refEl: React.RefObject<HTMLElement | null>;
  setOpen: (open: boolean) => void;
}

export const ScheduleUndispatchedBaseTasksPopconfirm: React.FC<Props> = ({
  onConfirm,
  open,
  refEl,
  setOpen,
}) => (
  <Popconfirm
    data-testid="schedule-undispatched-base-popconfirm"
    onConfirm={onConfirm}
    open={open}
    refEl={refEl}
    setOpen={setOpen}
    side="left"
  >
    <div className={styles.message}>
      Are you sure you want to schedule all the undispatched base tasks for this
      patch&apos;s failing tasks?
    </div>
  </Popconfirm>
);
