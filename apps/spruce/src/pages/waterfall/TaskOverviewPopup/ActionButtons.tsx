import { useMutation } from "@apollo/client/react";
import styled from "@emotion/styled";
import { Button, Size as ButtonSize } from "@leafygreen-ui/button";
import { IconButton } from "@leafygreen-ui/icon-button";
import { Link } from "react-router-dom";
import Icon from "@evg-ui/lib/components/Icon";
import { size } from "@evg-ui/lib/constants/tokens";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { useQueryParams } from "@evg-ui/lib/hooks";
import { getParsleyTaskLogLink } from "constants/externalResources";
import { getTaskRoute } from "constants/routes";
import {
  RestartTaskMutation,
  RestartTaskMutationVariables,
} from "gql/generated/types";
import { RESTART_TASK } from "gql/mutations";
import { LogTypes, TaskTab } from "types/task";
import { WaterfallFilterOptions } from "../types";

interface ActionButtonsProps {
  buildVariant?: string;
  displayName?: string;
  execution: number;
  setOpen: (open: boolean) => void;
  taskId: string;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  buildVariant,
  displayName,
  execution,
  setOpen,
  taskId,
}) => {
  const [, setQueryParams] = useQueryParams();
  const dispatchToast = useToastContext();

  const [restartTask, { loading: loadingRestartTask }] = useMutation<
    RestartTaskMutation,
    RestartTaskMutationVariables
  >(RESTART_TASK, {
    onCompleted: (result) => {
      const priority = result.restartTask?.priority ?? 0;
      if (priority < 0) {
        dispatchToast.warning(
          `Task '${displayName}' was scheduled to restart, but is disabled. Enable the task to run.`,
        );
      } else {
        dispatchToast.success(`Task '${displayName}' scheduled to restart`);
      }
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
    setQueryParams({
      [WaterfallFilterOptions.Task]: displayName ? [displayName] : [],
      [WaterfallFilterOptions.BuildVariant]: buildVariant ? [buildVariant] : [],
    });
  };

  return (
    <ButtonRow>
      <IconButton
        aria-label="Restart task"
        disabled={loadingRestartTask}
        onClick={handleRestartClick}
      >
        <Icon aria-label="Restart task" glyph="Refresh" />
      </IconButton>
      <IconButton aria-label="Filter for this task" onClick={handleFilterClick}>
        <Icon aria-label="Filter for this task" glyph="Filter" />
      </IconButton>
      <Button
        as={Link}
        size={ButtonSize.Small}
        to={getParsleyTaskLogLink(LogTypes.Task, taskId, execution)}
      >
        Task logs
      </Button>
      <Button
        as={Link}
        size={ButtonSize.Small}
        to={getTaskRoute(taskId, {
          execution,
          tab: TaskTab.History,
        })}
      >
        Task history
      </Button>
    </ButtonRow>
  );
};

const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${size.xs};
`;
