import { useMutation } from "@apollo/client/react";
import { Body } from "@via-ds/components";
import Popconfirm from "@evg-ui/lib/components/Popconfirm";
import { useToastContext } from "@evg-ui/lib/context/toast";
import {
  SetVersionPriorityMutation,
  SetVersionPriorityMutationVariables,
} from "gql/generated/types";
import { SET_VERSION_PRIORITY } from "gql/mutations";
import styles from "./PopconfirmMessage.module.css";

// The mutation lives in a hook so its callbacks survive the popconfirm
// unmounting on confirm.
export const useDisableVersionTasks = (
  versionId: string,
  refetchQueries: string[] = [],
) => {
  const dispatchToast = useToastContext();

  const [disableVersion, { loading }] = useMutation<
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

  const disable = () => {
    disableVersion({ variables: { versionId, priority: -1 } });
  };

  return { disable, loading };
};

interface Props {
  onConfirm: () => void;
  open: boolean;
  refEl: React.RefObject<HTMLElement | null>;
  setOpen: (open: boolean) => void;
}
export const DisableTasksPopconfirm: React.FC<Props> = ({
  onConfirm,
  open,
  refEl,
  setOpen,
}) => (
  <Popconfirm
    onConfirm={onConfirm}
    open={open}
    refEl={refEl}
    setOpen={setOpen}
    side="left"
  >
    <div className={styles.message}>
      <Body>Disable all tasks?</Body>
      <Body>
        Disabling tasks prevents them from running unless explicitly activated
        by a user.
      </Body>
    </div>
  </Popconfirm>
);
