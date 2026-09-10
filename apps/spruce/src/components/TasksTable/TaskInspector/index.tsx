import { useQuery } from "@apollo/client/react";
import { palette } from "@leafygreen-ui/palette";
import { Link } from "react-router-dom";
import TaskStatusBadge from "@evg-ui/lib/components/Badge/TaskStatusBadge";
import { Icon } from "@evg-ui/lib/components/Icon";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { TaskTableInfo } from "components/TasksTable/types";
import { getTaskRoute } from "constants/routes";
import {
  TaskAllExecutionsQuery,
  TaskAllExecutionsQueryVariables,
} from "gql/generated/types";
import { TASK_ALL_EXECUTIONS } from "gql/queries";
import { TaskTab } from "types/task";
import { msToDuration } from "utils/string";
import styles from "./index.module.css";

interface TaskInspectorProps {
  isPatch: boolean;
  onClickTaskLink?: (taskId: string, status?: string) => void;
  onClickTaskStatusBadge?: (
    taskId: string,
    status: string,
    column: string,
  ) => void;
  task?: TaskTableInfo;
}

export const TaskInspector: React.FC<TaskInspectorProps> = ({
  isPatch,
  onClickTaskLink,
  onClickTaskStatusBadge,
  task,
}) => {
  const { data, loading: loadingExecutions } = useQuery<
    TaskAllExecutionsQuery,
    TaskAllExecutionsQueryVariables
  >(TASK_ALL_EXECUTIONS, {
    fetchPolicy: "no-cache",
    skip: !task?.id || !task.execution,
    variables: { taskId: task?.id ?? "" },
  });
  const earlierExecutions = (data?.taskAllExecutions ?? [])
    .filter(({ execution }) => execution < (task?.execution ?? 0))
    .toReversed();

  if (!task) {
    return (
      <aside className={styles.inspector} data-testid="task-inspector">
        <span className={styles.eyebrow}>Task details</span>
        <strong>Select a task</strong>
        <p>Choose a row to compare runs and open a specific task.</p>
      </aside>
    );
  }

  const { baseTask } = task;
  const lastRun = baseTask?.prevTaskCompleted;
  return (
    <aside className={styles.inspector} data-testid="task-inspector">
      <div className={styles.heading}>
        <strong>{task.displayName}</strong>
        <span>{task.buildVariantDisplayName}</span>
      </div>
      <div className={styles.runs}>
        <RunLink
          execution={task.execution}
          id={task.id}
          label="Current"
          onClick={() => onClickTaskLink?.(task.id, task.displayStatus)}
          status={task.displayStatus as TaskStatus}
          timeTaken={task.timeTaken}
        />
        {baseTask && (
          <RunLink
            execution={baseTask.execution}
            id={baseTask.id}
            label={isPatch ? "Base" : "Previous"}
            onClick={() =>
              onClickTaskStatusBadge?.(
                task.id,
                baseTask.displayStatus,
                "BASE_STATUS",
              )
            }
            status={baseTask.displayStatus as TaskStatus}
            timeTaken={baseTask.timeTaken}
          />
        )}
        {lastRun && (
          <RunLink
            execution={lastRun.execution}
            id={lastRun.id}
            label="Last run"
            onClick={() =>
              onClickTaskStatusBadge?.(
                task.id,
                lastRun.displayStatus,
                "last-run-status",
              )
            }
            status={lastRun.displayStatus as TaskStatus}
            tab={TaskTab.History}
            timeTaken={lastRun.timeTaken}
          />
        )}
      </div>
      <div className={styles.executionHistory}>
        <span className={styles.eyebrow}>Earlier executions</span>
        {loadingExecutions && <p>Loading executions...</p>}
        {!loadingExecutions && earlierExecutions.length === 0 && (
          <p>No earlier executions</p>
        )}
        {earlierExecutions.map((execution) => (
          <Link
            key={execution.execution}
            aria-label={`Open execution ${execution.execution + 1}`}
            className={styles.executionLink}
            to={getTaskRoute(task.id, { execution: execution.execution })}
          >
            <span>Execution {execution.execution + 1}</span>
            <span className={styles.destination}>
              <TaskStatusBadge status={execution.displayStatus as TaskStatus} />
              <Icon fill={palette.blue.base} glyph="OpenNewTab" />
            </span>
          </Link>
        ))}
      </div>
      <dl className={styles.details}>
        <div>
          <dt>Execution</dt>
          <dd>{task.execution + 1}</dd>
        </div>
        {!!task.dependsOn?.length && (
          <div>
            <dt>Depends on</dt>
            <dd>{task.dependsOn.map(({ name }) => name).join(", ")}</dd>
          </div>
        )}
        {!!task.errors?.length && (
          <div>
            <dt>Task errors</dt>
            <dd>{task.errors.join(", ")}</dd>
          </div>
        )}
      </dl>
    </aside>
  );
};

const RunLink: React.FC<{
  execution: number;
  id: string;
  label: string;
  onClick?: () => void;
  status: TaskStatus;
  tab?: TaskTab;
  timeTaken?: number | null;
}> = ({ execution, id, label, onClick, status, tab, timeTaken }) => (
  <Link
    aria-label={`Open ${label.toLowerCase()} task`}
    className={styles.runLink}
    onClick={onClick}
    to={getTaskRoute(id, { execution, tab })}
  >
    <span className={styles.runSummary}>
      <span>{label}</span>
      <small>
        {timeTaken ? msToDuration(timeTaken) : "No duration recorded"}
      </small>
    </span>
    <span className={styles.destination}>
      <TaskStatusBadge status={status} />
      <Icon fill={palette.blue.base} glyph="OpenNewTab" />
    </span>
  </Link>
);
