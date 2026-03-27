import { skipToken, useQuery } from "@apollo/client/react";
import styled from "@emotion/styled";
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

interface StepbackMenuProps {
  task: NonNullable<TaskQuery["task"]>;
}

type PreviousTask = Pick<
  Task,
  "id" | "execution" | "displayStatus" | "revision"
> | null;

export const StepbackMenu: React.FC<StepbackMenuProps> = ({ task }) => {
  const { sendEvent } = useTaskAnalytics();

  const { baseTask, versionMetadata } = task ?? {};

  const { data, loading } = useQuery<
    StepbackTasksQuery,
    StepbackTasksQueryVariables
  >(
    STEPBACK_TASKS,
    versionMetadata?.isPatch
      ? skipToken
      : {
          variables: {
            taskId: task.id,
            execution: task.execution,
            isPassing: task.status === TaskStatus.Succeeded,
          },
        },
  );

  const { prevTask, prevTaskCompleted, prevTaskPassing } = data?.task || {};

  if (!baseTask) {
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
        <Button rightGlyph={<Icon glyph="CaretDown" />} size={Size.Small}>
          Stepback
        </Button>
      }
    >
      {versionMetadata?.isPatch ? (
        <RelevantCommitItem
          description="View further stepback details on the base commit page."
          disabled={loading}
          label="Base commit"
          onClick={() =>
            sendEvent({
              name: "Clicked relevant commit",
              type: CommitType.Base,
            })
          }
          task={baseTask}
        />
      ) : (
        <>
          <RelevantCommitItem
            disabled={loading}
            label="Previous commit"
            onClick={() =>
              sendEvent({
                name: "Clicked relevant commit",
                type: CommitType.Base,
              })
            }
            task={prevTask}
          />
          <RelevantCommitItem
            disabled={loading}
            label="Last completed"
            onClick={() =>
              sendEvent({
                name: "Clicked relevant commit",
                type: CommitType.LastExecuted,
              })
            }
            task={prevTaskCompleted}
          />
          <RelevantCommitItem
            disabled={loading}
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
            disabled={loading}
            isCurrentTask={task.id === prevTaskPassing?.nextTaskFailing?.id}
            label="Breaking commit"
            onClick={() =>
              sendEvent({
                name: "Clicked relevant commit",
                type: CommitType.Breaking,
              })
            }
            task={prevTaskPassing?.nextTaskFailing}
          />
        </>
      )}
    </Menu>
  );
};

type RelevantCommitItemProps = {
  isCurrentTask?: boolean;
  disabled: boolean;
  label: string;
  onClick?: () => void;
  task?: PreviousTask;
} & MenuItemProps;

const RelevantCommitItem: React.FC<RelevantCommitItemProps> = ({
  description,
  disabled,
  isCurrentTask,
  label,
  onClick,
  task,
}) => {
  if (disabled || !task || isCurrentTask) {
    return (
      <MenuItem disabled>
        <MenuContainer>
          <IconContainer />
          <Label>{label}</Label>
          {isCurrentTask && <span>Current</span>}
        </MenuContainer>
      </MenuItem>
    );
  }

  const to = getTaskRoute(task.id, { execution: task.execution });
  return (
    <MenuItem as={Link} description={description} onClick={onClick} to={to}>
      <MenuContainer>
        <IconContainer>
          <ExecutionStatusIcon status={task.displayStatus} />
        </IconContainer>
        <Label>{label}</Label>
        {task.revision && (
          <InlineCode>{shortenGithash(task.revision)}</InlineCode>
        )}
      </MenuContainer>
    </MenuItem>
  );
};

const MenuContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2px;
`;

const IconContainer = styled.span`
  display: flex;
  align-items: center;
  width: 16px;
`;

const Label = styled.span`
  flex-grow: 2;
`;
