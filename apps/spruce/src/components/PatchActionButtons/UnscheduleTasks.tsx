import { useRef, useState } from "react";
import { useMutation } from "@apollo/client";
import { Checkbox } from "@leafygreen-ui/checkbox";
import { MenuItem } from "@leafygreen-ui/menu";
import { Body } from "@leafygreen-ui/typography";
import Popconfirm from "@evg-ui/lib/components/Popconfirm";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { useVersionAnalytics } from "analytics";
import {
  UnscheduleVersionTasksMutation,
  UnscheduleVersionTasksMutationVariables,
} from "gql/generated/types";
import { UNSCHEDULE_VERSION_TASKS } from "gql/mutations";

interface props {
  disabled?: boolean;
  refetchQueries?: string[];
  versionId: string;
}
export const UnscheduleTasks: React.FC<props> = ({
  disabled,
  refetchQueries = [],
  versionId,
}) => {
  const dispatchToast = useToastContext();
  const { sendEvent } = useVersionAnalytics(versionId);

  const [abort, setAbort] = useState(true);
  const [open, setOpen] = useState(false);
  const menuItemRef = useRef<HTMLDivElement>(null);

  const [unscheduleVersionTasks, { loading: loadingUnscheduleVersionTasks }] =
    useMutation<
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
    <>
      <div ref={menuItemRef}>
        <MenuItem
          active={open}
          data-cy="unschedule-patch"
          disabled={disabled || loadingUnscheduleVersionTasks}
          onClick={() => setOpen(!open)}
        >
          Unschedule all tasks
        </MenuItem>
      </div>
      <Popconfirm
        align="left"
        data-cy="unschedule-patch-popconfirm"
        onConfirm={onConfirm}
        open={open}
        refEl={menuItemRef}
        setOpen={setOpen}
      >
        <Body weight="medium">Unschedule all tasks?</Body>
        <Checkbox
          checked={abort}
          data-cy="abort-checkbox"
          label="Abort tasks that have already started"
          onChange={() => setAbort(!abort)}
        />
      </Popconfirm>
    </>
  );
};
