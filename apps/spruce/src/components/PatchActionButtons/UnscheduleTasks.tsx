import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { Body, Checkbox } from "@via-ds/components";
import Popconfirm from "@evg-ui/lib/components/Popconfirm";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { useVersionAnalytics } from "analytics";
import {
  UnscheduleVersionTasksMutation,
  UnscheduleVersionTasksMutationVariables,
} from "gql/generated/types";
import { UNSCHEDULE_VERSION_TASKS } from "gql/mutations";

interface props {
  open: boolean;
  refEl: React.RefObject<HTMLElement | null>;
  refetchQueries?: string[];
  setOpen: (open: boolean) => void;
  versionId: string;
}
export const UnscheduleTasksPopconfirm: React.FC<props> = ({
  open,
  refEl,
  refetchQueries = [],
  setOpen,
  versionId,
}) => {
  const dispatchToast = useToastContext();
  const { sendEvent } = useVersionAnalytics(versionId);

  const [abort, setAbort] = useState(true);

  const [unscheduleVersionTasks] = useMutation<
    UnscheduleVersionTasksMutation,
    UnscheduleVersionTasksMutationVariables
  >(UNSCHEDULE_VERSION_TASKS, {
    onCompleted: () => {
      dispatchToast.success(
        `All tasks were unscheduled ${
          abort ? "and tasks that already started were aborted" : ""
        }`,
      );
      setAbort(false);
    },
    onError: (err) => {
      dispatchToast.error(`Error unscheduling tasks: ${err.message}`);
    },
    refetchQueries,
  });

  const onConfirm = () => {
    unscheduleVersionTasks({ variables: { versionId, abort } });
    sendEvent({ name: "Clicked unschedule tasks button", abort });
  };

  return (
    <Popconfirm
      data-testid="unschedule-patch-popconfirm"
      onConfirm={onConfirm}
      open={open}
      refEl={refEl}
      setOpen={setOpen}
      side="left"
    >
      <Body>Unschedule all tasks?</Body>
      <Checkbox
        data-testid="abort-checkbox"
        isSelected={abort}
        onChange={setAbort}
      >
        Abort tasks that have already started
      </Checkbox>
    </Popconfirm>
  );
};
