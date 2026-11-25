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

export const useUnscheduleVersionTasks = (
  versionId: string,
  refetchQueries: string[] = [],
) => {
  const dispatchToast = useToastContext();
  const { sendEvent } = useVersionAnalytics(versionId);

  const [unscheduleVersionTasks, { loading }] = useMutation<
    UnscheduleVersionTasksMutation,
    UnscheduleVersionTasksMutationVariables
  >(UNSCHEDULE_VERSION_TASKS, {
    onError: (err) => {
      dispatchToast.error(`Error unscheduling tasks: ${err.message}`);
    },
    refetchQueries,
  });

  const unschedule = (abort: boolean) => {
    unscheduleVersionTasks({
      onCompleted: () => {
        dispatchToast.success(
          `All tasks were unscheduled ${
            abort ? "and tasks that already started were aborted" : ""
          }`,
        );
      },
      variables: { versionId, abort },
    });
    sendEvent({ name: "Clicked unschedule tasks button", abort });
  };

  return { loading, unschedule };
};

interface props {
  onConfirm: (abort: boolean) => void;
  open: boolean;
  refEl: React.RefObject<HTMLElement | null>;
  setOpen: (open: boolean) => void;
}
export const UnscheduleTasksPopconfirm: React.FC<props> = ({
  onConfirm,
  open,
  refEl,
  setOpen,
}) => {
  const [abort, setAbort] = useState(true);

  return (
    <Popconfirm
      data-testid="unschedule-patch-popconfirm"
      onConfirm={() => onConfirm(abort)}
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
