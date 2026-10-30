import { forwardRef } from "react";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { statusColorMap } from "components/TaskBox";
import { Requester } from "constants/requesters";
import { useDateFormat } from "hooks";
import {
  stickyHeaderScrollOffset,
  walkthroughCommitCardProps,
} from "../constants";
import { useTaskHistoryContext } from "../context";
import { TaskHistoryTask } from "../types";
import { getTaskIngestTime } from "../utils";
import styles from "./CommitDetailsCard.module.css";
import { CommitInfo } from "./CommitInfo";
import { CommitMessage } from "./CommitMessage";
import { Header } from "./Header";

interface CommitDetailsCardProps {
  isMatching: boolean;
  task: TaskHistoryTask;
}

const CommitDetailsCard = forwardRef<HTMLDivElement, CommitDetailsCardProps>(
  ({ isMatching, task }, ref) => {
    const getDateCopy = useDateFormat();

    const { baseTaskId, currentTask, isPatch, selectedTask, setHoveredTask } =
      useTaskHistoryContext();

    const { displayStatus, id: taskId, requester } = task;

    const isCurrentTask = isPatch
      ? taskId === baseTaskId
      : taskId === currentTask.id;
    const isSelectedTask = taskId === selectedTask;
    const isTrigger = requester === Requester.Trigger;

    const ingestTime = getTaskIngestTime(task);
    const ingestDate = new Date(ingestTime ?? "");
    const dateCopy = getDateCopy(ingestDate, {
      omitSeconds: true,
      omitTimezone: true,
    });

    // These values are only known at runtime, so they're handed to the
    // stylesheet as CSS variables.
    const cardCssVariables = {
      "--status-color": statusColorMap[displayStatus as TaskStatus],
      "--scroll-margin-top": `${stickyHeaderScrollOffset}px`,
    } as React.CSSProperties;

    return (
      <div
        key={taskId}
        ref={ref}
        className={styles.card}
        data-matching={isMatching}
        data-selected={isSelectedTask}
        data-testid="commit-details-card"
        id={`commit-card-${taskId}`}
        onMouseEnter={() => setHoveredTask(taskId)}
        onMouseLeave={() => setHoveredTask(null)}
        style={cardCssVariables}
        {...walkthroughCommitCardProps}
      >
        <Header dateCopy={dateCopy} isCurrentTask={isCurrentTask} task={task} />
        <CommitInfo isTrigger={isTrigger} task={task} />
        <CommitMessage task={task} />
      </div>
    );
  },
);
CommitDetailsCard.displayName = "CommitDetailsCard";

export default CommitDetailsCard;
