import { useMutation } from "@apollo/client/react";
import { Body } from "@via-ds/components";
import Popconfirm from "@evg-ui/lib/components/Popconfirm";
import { useToastContext } from "@evg-ui/lib/context/toast";
import {
  SetVersionPriorityMutation,
  SetVersionPriorityMutationVariables,
} from "gql/generated/types";
import { SET_VERSION_PRIORITY } from "gql/mutations";

interface Props {
  open: boolean;
  refEl: React.RefObject<HTMLElement | null>;
  refetchQueries?: string[];
  setOpen: (open: boolean) => void;
  versionId: string;
}
export const DisableTasksPopconfirm: React.FC<Props> = ({
  open,
  refEl,
  refetchQueries = [],
  setOpen,
  versionId,
}) => {
  const dispatchToast = useToastContext();

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
    <Popconfirm
      onConfirm={() => {
        disableVersion({
          variables: { versionId, priority: -1 },
        });
      }}
      open={open}
      refEl={refEl}
      setOpen={setOpen}
      side="left"
    >
      <Body>Disable all tasks?</Body>
      <Body>
        Disabling tasks prevents them from running unless explicitly activated
        by a user.
      </Body>
    </Popconfirm>
  );
};
