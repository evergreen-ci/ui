import { useMutation } from "@apollo/client/react";
import { Badge, Variant as BadgeVariant } from "@leafygreen-ui/badge";
import { Button, Size as ButtonSize } from "@leafygreen-ui/button";
import { Chip, Variant as ChipVariant } from "@leafygreen-ui/chip";
import { InfoSprinkle } from "@via-ds/components";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { useQueryParam } from "@evg-ui/lib/hooks";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { useTaskHistoryAnalytics } from "analytics";
import SetPriority, { Align } from "components/SetPriority";
import {
  RestartTaskMutation,
  RestartTaskMutationVariables,
  ScheduleTasksMutation,
  ScheduleTasksMutationVariables,
} from "gql/generated/types";
import { RESTART_TASK, SCHEDULE_TASKS } from "gql/mutations";
import { NotifyMeButton } from "pages/task/ActionButtons/NotifyMeButton";
import { NotificationModalSource } from "types/subscription";
import { RequiredQueryParams } from "types/task";
import { useTaskHistoryContext } from "../context";
import { TaskHistoryTask } from "../types";
import styles from "./CommitDetailsCard.module.css";

interface HeaderProps {
  dateCopy: string;
  isCurrentTask: boolean;
  task: TaskHistoryTask;
}

export const Header: React.FC<HeaderProps> = ({
  dateCopy,
  isCurrentTask,
  task,
}) => {
  const { sendEvent } = useTaskHistoryAnalytics();
  const dispatchToast = useToastContext();
  const { expandedTasksMap, isPatch, setExpandedTasksMap } =
    useTaskHistoryContext();
  const [, setExecution] = useQueryParam(RequiredQueryParams.Execution, 0);

  const {
    activated,
    canRestart,
    canSchedule,
    canSetPriority,
    execution,
    generator,
    id: taskId,
    priority,
    version,
  } = task;
  const { id: versionId } = version;

  const [scheduleTask] = useMutation<
    ScheduleTasksMutation,
    ScheduleTasksMutationVariables
  >(SCHEDULE_TASKS, {
    onCompleted: () => {
      const newMap = new Map(expandedTasksMap);
      newMap.delete(task.id);
      setExpandedTasksMap(newMap);
      dispatchToast.success("Task scheduled to run");
    },
    onError: (err) => {
      dispatchToast.error(`Error scheduling task: ${err.message}`);
    },
    update: (cache) => {
      cache.modify({
        id: cache.identify(task),
        fields: {
          canSchedule: () => false,
          canSetPriority: () => true,
          displayStatus: () => TaskStatus.WillRun,
          activated: () => true,
        },
        broadcast: true,
      });
    },
  });

  const [restartTask] = useMutation<
    RestartTaskMutation,
    RestartTaskMutationVariables
  >(RESTART_TASK, {
    onCompleted: (data) => {
      dispatchToast.success("Task scheduled to restart");
      if (isCurrentTask) {
        const newerExecution = data?.restartTask.latestExecution ?? 0;
        setExecution(newerExecution);
      }
    },
    onError: (err) =>
      dispatchToast.error(`Error restarting task: ${err.message}`),
    update: (cache) => {
      if (!isCurrentTask) {
        cache.modify({
          id: cache.identify(task),
          fields: {
            canRestart: () => false,
            canSetPriority: () => true,
            displayStatus: () => TaskStatus.WillRun,
            execution: (cachedExecution: number) => cachedExecution + 1,
          },
          broadcast: false,
        });
      }
    },
    // Only re-request if the current task is restarted. This should be relatively
    // uncommon.
    refetchQueries: [isCurrentTask ? "TaskHistory" : ""],
  });

  return (
    <div className={styles.row}>
      <div className={styles.row}>
        <span>{dateCopy}</span>
        {generator?.ingestTime && (
          <InfoSprinkle>
            Generated tasks are sorted by generator ingest time.
          </InfoSprinkle>
        )}
      </div>
      {isCurrentTask && (
        <Badge data-testid="this-task-badge" variant={BadgeVariant.Blue}>
          {isPatch ? "Base" : "This"} Task
        </Badge>
      )}
      {execution > 0 ? (
        <Chip
          data-testid="execution-chip"
          label={`Executions: ${execution + 1}`}
          variant={ChipVariant.Gray}
        />
      ) : null}
      {priority && priority > 0 ? (
        <Chip
          data-testid="priority-chip"
          label={`Priority: ${priority}`}
          variant={ChipVariant.Gray}
        />
      ) : null}
      <div className={styles.buttonContainer}>
        {activated ? (
          <Button
            data-testid="restart-button"
            disabled={!canRestart}
            onClick={() => {
              sendEvent({
                name: "Clicked restart task button",
                "task.id": taskId,
              });
              restartTask({ variables: { taskId, failedOnly: false } });
            }}
            size={ButtonSize.XSmall}
          >
            Restart Task
          </Button>
        ) : (
          <Button
            data-testid="schedule-button"
            disabled={!canSchedule}
            onClick={() => {
              sendEvent({
                name: "Clicked schedule task button",
                "task.id": taskId,
              });
              scheduleTask({ variables: { taskIds: [taskId], versionId } });
            }}
            size={ButtonSize.XSmall}
          >
            Schedule Task
          </Button>
        )}
        <NotifyMeButton
          buttonSize={ButtonSize.XSmall}
          source={NotificationModalSource.TaskHistory}
          taskId={taskId}
        />
        <SetPriority
          disabled={!canSetPriority}
          initialPriority={priority ?? 0}
          isButton
          popconfirmAlign={Align.Top}
          taskIds={[taskId]}
        />
      </div>
    </div>
  );
};
