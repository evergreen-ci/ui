import { useMutation } from "@apollo/client/react";
import styled from "@emotion/styled";
import { Button, Size as ButtonSize } from "@leafygreen-ui/button";
import { Link } from "react-router-dom";
import { size } from "@evg-ui/lib/constants/tokens";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { useQueryParams } from "@evg-ui/lib/hooks";
import { getParsleyTaskLogLink } from "constants/externalResources";
import { getTaskRoute } from "constants/routes";
import {
  RestartTaskMutation,
  RestartTaskMutationVariables,
  TaskOverviewPopupQuery,
} from "gql/generated/types";
import { RESTART_TASK } from "gql/mutations";
import { LogTypes, TaskTab } from "types/task";
import { WaterfallFilterOptions } from "../types";

interface ActionButtonsProps {
  task: NonNullable<TaskOverviewPopupQuery["task"]>;
  setOpen: (open: boolean) => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  setOpen,
  task,
}) => {
  const [, setQueryParams] = useQueryParams();
  const dispatchToast = useToastContext();

  const { buildVariant, canRestart, displayName, execution, id: taskId } = task;

  const [restartTask] = useMutation<
    RestartTaskMutation,
    RestartTaskMutationVariables
  >(RESTART_TASK, {
    onCompleted: () => {
      dispatchToast.success(`Task '${displayName}' scheduled to restart`);
    },
    onError: (err) => {
      dispatchToast.error(
        `Error restarting task '${displayName}': ${err.message}`,
      );
    },
  });

  const handleRestartClick = () => {
    setOpen(false);
    restartTask({ variables: { taskId, failedOnly: false } });
  };

  const handleFilterClick = () => {
    setOpen(false);
    setQueryParams((current) => ({
      ...current,
      [WaterfallFilterOptions.Task]: displayName ? [displayName] : [],
      [WaterfallFilterOptions.BuildVariant]: buildVariant ? [buildVariant] : [],
    }));
  };

  return (
    <ButtonRow>
      <Button
        disabled={!canRestart}
        onClick={handleRestartClick}
        size={ButtonSize.Small}
      >
        Restart
      </Button>
      <Button onClick={handleFilterClick} size={ButtonSize.Small}>
        Filter
      </Button>
      <Button
        as={Link}
        size={ButtonSize.Small}
        to={getParsleyTaskLogLink(LogTypes.Task, taskId, execution)}
      >
        Logs
      </Button>
      <Button
        as={Link}
        size={ButtonSize.Small}
        to={getTaskRoute(taskId, {
          execution,
          tab: TaskTab.History,
        })}
      >
        History
      </Button>
    </ButtonRow>
  );
};

const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${size.xxs};
`;
