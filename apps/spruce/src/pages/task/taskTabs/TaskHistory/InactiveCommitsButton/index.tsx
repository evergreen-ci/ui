import { useState } from "react";
import Button from "@leafygreen-ui/button";
import Icon from "@leafygreen-ui/icon";
import { Size } from "@leafygreen-ui/tokens";
import pluralize from "pluralize";
import { TaskQuery } from "gql/generated/types";
import CommitDetailsCard from "../CommitDetailsCard";
import { TaskHistoryTask } from "../types";

interface Props {
  inactiveTasks: TaskHistoryTask[];
  currentTask: NonNullable<TaskQuery["task"]>;
}
export const InactiveCommitsButton: React.FC<Props> = ({
  currentTask,
  inactiveTasks,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <>
      <span>
        <Button
          data-cy="collapsed-card"
          leftGlyph={
            isExpanded ? (
              <Icon glyph="ChevronDown" />
            ) : (
              <Icon glyph="ChevronRight" />
            )
          }
          onClick={() => setIsExpanded(!isExpanded)}
          size={Size.XSmall}
        >
          {inactiveTasks.length}{" "}
          {isExpanded
            ? "EXPANDED"
            : pluralize("INACTIVE COMMIT", inactiveTasks.length)}
        </Button>
      </span>
      {isExpanded &&
        inactiveTasks.map((inactiveTask) => (
          <CommitDetailsCard
            key={inactiveTask.id}
            isCurrentTask={inactiveTask.id === currentTask.id}
            owner={currentTask.project?.owner}
            repo={currentTask.project?.repo}
            task={inactiveTask}
          />
        ))}
    </>
  );
};
