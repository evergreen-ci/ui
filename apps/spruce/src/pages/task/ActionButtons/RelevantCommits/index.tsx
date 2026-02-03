import { useMemo } from "react";
import { Button, Size } from "@leafygreen-ui/button";
import { Menu, MenuItem, MenuItemProps } from "@leafygreen-ui/menu";
import { Tooltip } from "@leafygreen-ui/tooltip";
import { Link } from "react-router-dom";
import { Icon } from "@evg-ui/lib/components";
import { useTaskAnalytics } from "analytics";
import { TaskQuery } from "gql/generated/types";
import { useBreakingTask } from "hooks/useBreakingTask";
import { useLastPassingTask } from "hooks/useLastPassingTask";
import { useParentTask } from "hooks/useParentTask";
import { CommitType } from "./types";
import { useLastExecutedTask } from "./useLastExecutedTask";
import { getLinks } from "./utils";

interface RelevantCommitsProps {
  task: NonNullable<TaskQuery["task"]>;
}

export const RelevantCommits: React.FC<RelevantCommitsProps> = ({ task }) => {
  const { sendEvent } = useTaskAnalytics();

  const { baseTask, versionMetadata } = task ?? {};

  const { loading: parentLoading, task: parentTask } = useParentTask(task.id);

  const { loading: passingLoading, task: lastPassingTask } = useLastPassingTask(
    task.id,
  );

  const { loading: breakingLoading, task: breakingTask } = useBreakingTask(
    task.id,
  );

  const { loading: executedLoading, task: lastExecutedTask } =
    useLastExecutedTask(task.id);

  const linkObject = useMemo(
    () =>
      getLinks({
        parentTask,
        breakingTask,
        lastPassingTask,
        lastExecutedTask,
      }),
    [parentTask, breakingTask, lastPassingTask, lastExecutedTask],
  );

  const menuDisabled = !baseTask || !parentTask;

  return menuDisabled ? (
    <Tooltip
      justify="middle"
      trigger={
        <Button
          disabled
          rightGlyph={<Icon glyph="CaretDown" />}
          size={Size.Small}
        >
          Relevant commits
        </Button>
      }
    >
      No relevant versions available.
    </Tooltip>
  ) : (
    <Menu
      trigger={
        <Button rightGlyph={<Icon glyph="CaretDown" />} size={Size.Small}>
          Relevant commits
        </Button>
      }
    >
      <RelevantCommitItem
        disabled={parentLoading}
        onClick={() =>
          sendEvent({
            name: "Clicked relevant commit",
            type: CommitType.Base,
          })
        }
        to={linkObject[CommitType.Base]}
      >
        Go to {versionMetadata?.isPatch ? "base" : "previous"} commit
      </RelevantCommitItem>
      <RelevantCommitItem
        disabled={breakingLoading || breakingTask === undefined}
        onClick={() =>
          sendEvent({
            name: "Clicked relevant commit",
            type: CommitType.Breaking,
          })
        }
        to={linkObject[CommitType.Breaking]}
      >
        Go to breaking commit
      </RelevantCommitItem>
      <RelevantCommitItem
        disabled={passingLoading}
        onClick={() =>
          sendEvent({
            name: "Clicked relevant commit",
            type: CommitType.LastPassing,
          })
        }
        to={linkObject[CommitType.LastPassing]}
      >
        Go to last passing version
      </RelevantCommitItem>
      <RelevantCommitItem
        disabled={executedLoading}
        onClick={() =>
          sendEvent({
            name: "Clicked relevant commit",
            type: CommitType.LastExecuted,
          })
        }
        to={linkObject[CommitType.LastExecuted]}
      >
        Go to last executed version
      </RelevantCommitItem>
    </Menu>
  );
};

type RelevantCommitItemProps = {
  disabled: boolean;
  to: string;
  onClick: () => void;
} & MenuItemProps;

const RelevantCommitItem: React.FC<RelevantCommitItemProps> = ({
  children,
  disabled,
  onClick,
  to,
}) => {
  if (disabled) {
    return <MenuItem disabled>{children}</MenuItem>;
  }
  return (
    <MenuItem as={Link} onClick={onClick} to={to}>
      {children}
    </MenuItem>
  );
};
