import { useMutation } from "@apollo/client/react";
import {
  Button,
  LinkButton,
  Tooltip,
  TooltipRoot,
  TooltipTrigger,
} from "@via-ds/components";
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
import styles from "./ActionButtons.module.css";

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

  const {
    buildVariant,
    canRestart,
    displayName,
    displayOnly,
    execution,
    id: taskId,
  } = task;

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
    <div className={styles.buttonRow}>
      <Button
        isDisabled={!canRestart}
        onPress={handleRestartClick}
        size="small"
      >
        Restart
      </Button>
      <Button onPress={handleFilterClick} size="small">
        Filter
      </Button>
      {displayOnly ? (
        <TooltipRoot>
          <TooltipTrigger>
            <span className={styles.disabledTooltipTrigger}>
              <Button isDisabled size="small">
                Logs
              </Button>
            </span>
          </TooltipTrigger>
          <Tooltip>Display tasks do not have logs.</Tooltip>
        </TooltipRoot>
      ) : (
        <LinkButton
          href={getParsleyTaskLogLink(LogTypes.Task, taskId, execution)}
          size="small"
        >
          Logs
        </LinkButton>
      )}
      <LinkButton
        href={getTaskRoute(taskId, {
          execution,
          tab: TaskTab.History,
        })}
        size="small"
      >
        History
      </LinkButton>
    </div>
  );
};
