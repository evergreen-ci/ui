import { useState, useRef } from "react";
import { useMutation } from "@apollo/client/react";
import { MenuItem } from "@leafygreen-ui/menu";
import { Body } from "@leafygreen-ui/typography";
import Popconfirm from "@evg-ui/lib/components/Popconfirm";
import { useToastContext } from "@evg-ui/lib/context/toast";
import {
  SetVersionPriorityMutation,
  SetVersionPriorityMutationVariables,
} from "gql/generated/types";
import { SET_VERSION_PRIORITY } from "gql/mutations";

interface Props {
  versionId: string;
  refetchQueries?: string[];
}
export const DisableTasks: React.FC<Props> = ({
  refetchQueries = [],
  versionId,
}) => {
  const dispatchToast = useToastContext();
  const [open, setOpen] = useState(false);
  const menuItemRef = useRef<HTMLDivElement>(null);

  const [disableVersion] = useMutation<
    SetVersionPriorityMutation,
    SetVersionPriorityMutationVariables
  >(SET_VERSION_PRIORITY, {
    onCompleted: () => {
      dispatchToast.success("Tasks in this version were disabled");
    },
    onError: (err) => {
      dispatchToast.error(`Unable to disable version's tasks: ${err.message}`);
    },
    refetchQueries,
  });

  return (
    <>
      <div ref={menuItemRef}>
        <MenuItem
          active={open}
          data-cy="disable"
          onClick={() => setOpen(!open)}
        >
          Disable all tasks
        </MenuItem>
      </div>
      <Popconfirm
        align="left"
        onConfirm={() => {
          disableVersion({
            variables: { versionId, priority: -1 },
          });
        }}
        open={open}
        refEl={menuItemRef}
        setOpen={setOpen}
      >
        <Body weight="medium">Disable all tasks?</Body>
        <Body>
          Disabling tasks prevents them from running unless explicitly activated
          by a user.
        </Body>
      </Popconfirm>
    </>
  );
};
