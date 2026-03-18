import { useLazyQuery } from "@apollo/client/react";
import { Button, Size } from "@leafygreen-ui/button";
import { Menu, MenuItem, MenuItemProps } from "@leafygreen-ui/menu";
import { Tooltip } from "@leafygreen-ui/tooltip";
import { InlineCode } from "@leafygreen-ui/typography";
import { Link } from "react-router-dom";
import Icon from "@evg-ui/lib/components/Icon";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { shortenGithash } from "@evg-ui/lib/utils/string";
import { useTaskAnalytics } from "analytics";
import { ExecutionStatusIcon } from "components/ExecutionStatusIcon";
import { getTaskRoute } from "constants/routes";
import {
  TaskQuery,
  StepbackTasksQuery,
  StepbackTasksQueryVariables,
  Task,
} from "gql/generated/types";
import { STEPBACK_TASKS } from "gql/queries";
import { CommitType } from "./types";

interface RelevantCommitsProps {
  task: NonNullable<TaskQuery["task"]>;
}

type PreviousTask = Pick<
  Task,
  "id" | "execution" | "displayStatus" | "revision"
> | null;

export const RelevantCommits: React.FC<RelevantCommitsProps> = ({ task }) => {
  const { sendEvent } = useTaskAnalytics();

  const { baseTask, versionMetadata } = task ?? {};

  const [getPreviousTasks, { called, data, loading }] = useLazyQuery<
    StepbackTasksQuery,
    StepbackTasksQueryVariables
  >(STEPBACK_TASKS);

  const handleClick = () => {
    const taskVars =
      versionMetadata?.isPatch && baseTask
        ? {
            taskId: baseTask.id,
            execution: baseTask.execution,
          }
        : {
            taskId: task.id,
            execution: task.execution,
          };
    getPreviousTasks({
      variables: {
        ...taskVars,
        isPassing: task.status === TaskStatus.Succeeded,
      },
    });
  };

  const menuDisabled = !baseTask;
  const pending = !called || loading;

  const { prevTask, prevTaskBreaking, prevTaskCompleted, prevTaskPassing } =
    data?.task || {};

  if (menuDisabled) {
    return (
      <Tooltip
        justify="middle"
        trigger={
          <Button
            disabled
            rightGlyph={<Icon glyph="CaretDown" />}
            size={Size.Small}
          >
            Stepback
          </Button>
        }
      >
        No historical task data available
      </Tooltip>
    );
  }

  return (
    <Menu
      renderDarkMenu={false}
      trigger={
        <Button
          onClick={handleClick}
          rightGlyph={<Icon glyph="CaretDown" />}
          size={Size.Small}
        >
          Stepback
        </Button>
      }
    >
      <RelevantCommitItem
        disabled={pending}
        label={`${versionMetadata?.isPatch ? "Base" : "Previous"} commit`}
        onClick={() =>
          sendEvent({
            name: "Clicked relevant commit",
            type: CommitType.Base,
          })
        }
        task={prevTask}
      />
      <RelevantCommitItem
        disabled={pending}
        label="Breaking commit"
        onClick={() =>
          sendEvent({
            name: "Clicked relevant commit",
            type: CommitType.Breaking,
          })
        }
        task={prevTaskBreaking}
      />
      <RelevantCommitItem
        disabled={pending}
        label="Last passing"
        onClick={() =>
          sendEvent({
            name: "Clicked relevant commit",
            type: CommitType.LastPassing,
          })
        }
        task={prevTaskPassing}
      />
      <RelevantCommitItem
        disabled={pending}
        label="Last completed"
        onClick={() =>
          sendEvent({
            name: "Clicked relevant commit",
            type: CommitType.LastExecuted,
          })
        }
        task={prevTaskCompleted}
      />
    </Menu>
  );
};

type RelevantCommitItemProps = {
  disabled: boolean;
  label: string;
  onClick?: () => void;
  task?: PreviousTask;
} & MenuItemProps;

const RelevantCommitItem: React.FC<RelevantCommitItemProps> = ({
  disabled,
  label,
  onClick,
  task,
}) => {
  if (disabled || !task) {
    return <MenuItem disabled>{label}</MenuItem>;
  }

  const to = getTaskRoute(task.id, { execution: task.execution });
  return (
    <MenuItem as={Link} onClick={onClick} to={to}>
      <ExecutionStatusIcon status={task.displayStatus} /> {label}{" "}
      {task.revision && (
        <InlineCode>{shortenGithash(task.revision)}</InlineCode>
      )}
    </MenuItem>
  );
};
