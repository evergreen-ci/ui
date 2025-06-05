import { useState } from "react";
import Button from "@leafygreen-ui/button";
import Icon from "@leafygreen-ui/icon";
import { Size } from "@leafygreen-ui/tokens";
import pluralize from "pluralize";
import { TaskQuery } from "gql/generated/types";
import { useQueryParam } from "hooks/useQueryParam";
import CommitDetailsCard from "../CommitDetailsCard";
import { TaskHistoryOptions, TaskHistoryTask } from "../types";

interface Props {
  inactiveTasks: TaskHistoryTask[];
  currentTask: NonNullable<TaskQuery["task"]>;
}
const InactiveCommitsButton: React.FC<Props> = ({
  currentTask,
  inactiveTasks,
}) => {
  const [failingTest] = useQueryParam<string>(
    TaskHistoryOptions.FailingTest,
    "",
  );
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
            ? "Expanded"
            : pluralize("Inactive Commit", inactiveTasks.length)}
        </Button>
      </span>
      {isExpanded &&
        inactiveTasks.map((inactiveTask) => (
          <CommitDetailsCard
            key={inactiveTask.id}
            isCurrentTask={inactiveTask.id === currentTask.id}
            isMatching={!failingTest}
            owner={currentTask.project?.owner}
            repo={currentTask.project?.repo}
            task={inactiveTask}
          />
        ))}
    </>
  );
};

export default InactiveCommitsButton;
