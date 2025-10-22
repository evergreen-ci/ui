import { useMemo } from "react";
import Button, { Size } from "@leafygreen-ui/button";
import { Menu, MenuItem, MenuItemProps } from "@leafygreen-ui/menu";
import Tooltip from "@leafygreen-ui/tooltip";
import { Link } from "react-router-dom";
import ConditionalWrapper from "@evg-ui/lib/components/ConditionalWrapper";
import Icon from "@evg-ui/lib/components/Icon";
import { useTaskAnalytics } from "analytics";
import { TaskQuery } from "gql/generated/types";
import { useBreakingTask } from "hooks/useBreakingTask";
import { useLastExecutedTask } from "hooks/useLastExecutedTask";
import { useLastPassingTask } from "hooks/useLastPassingTask";
import { useParentTask } from "hooks/useParentTask";
import { CommitType } from "./types";
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
      <ConditionalMenuItem
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
      </ConditionalMenuItem>
      <ConditionalMenuItem
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
      </ConditionalMenuItem>
      <ConditionalMenuItem
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
      </ConditionalMenuItem>
      <ConditionalMenuItem
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
      </ConditionalMenuItem>
    </Menu>
  );
};

type ConditionalMenuItemProps = {
  disabled: boolean;
  to: string;
  onClick: () => void;
} & MenuItemProps;
const ConditionalMenuItem: React.FC<ConditionalMenuItemProps> = ({
  children,
  disabled,
  onClick,
  to,
  ...props
}) => (
  <ConditionalWrapper
    condition={!!to && !disabled}
    wrapper={(c) => (
      <Link onClick={onClick} to={to}>
        {c}
      </Link>
    )}
  >
    {/* @ts-expect-error: Can't get around this type error */}
    <MenuItem as="button" disabled={disabled} onClick={onClick} {...props}>
      {children}
    </MenuItem>
  </ConditionalWrapper>
);
