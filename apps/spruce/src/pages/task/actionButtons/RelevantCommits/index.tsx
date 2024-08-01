import { useMemo } from "react";
import Button, { Size } from "@leafygreen-ui/button";
import { Menu, MenuItem } from "@leafygreen-ui/menu";
import Tooltip from "@leafygreen-ui/tooltip";
import { Link } from "react-router-dom";
import { useTaskAnalytics } from "analytics";
import Icon from "components/Icon";
import { TaskQuery } from "gql/generated/types";
import { useBreakingTask } from "hooks/useBreakingTask";
import { useLastExecutedTask } from "hooks/useLastExecutedTask";
import { useLastPassingTask } from "hooks/useLastPassingTask";
import { useParentTask } from "hooks/useParentTask";
import { CommitType } from "./types";
import { getLinks } from "./utils";

interface RelevantCommitsProps {
  task: TaskQuery["task"];
}

export const RelevantCommits: React.FC<RelevantCommitsProps> = ({ task }) => {
  const { sendEvent } = useTaskAnalytics();

  const { baseTask, versionMetadata } = task ?? {};

  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const { loading: parentLoading, task: parentTask } = useParentTask(task.id);

  const { loading: passingLoading, task: lastPassingTask } = useLastPassingTask(
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    task.id,
  );

  const { loading: breakingLoading, task: breakingTask } = useBreakingTask(
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    task.id,
  );

  const { loading: executedLoading, task: lastExecutedTask } =
    // @ts-expect-error: FIXME. This comment was added by an automated script.
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
      <MenuItem
        as={Link}
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
      </MenuItem>
      <MenuItem
        as={Link}
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
      </MenuItem>
      <MenuItem
        as={Link}
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
      </MenuItem>
      <MenuItem
        as={Link}
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
      </MenuItem>
    </Menu>
  );
};
