import { useState } from "react";
import Button from "@leafygreen-ui/button";
import { Icon } from "@leafygreen-ui/icon";
import { Size } from "@leafygreen-ui/tokens";
import pluralize from "pluralize";
import { useQueryParam } from "@evg-ui/lib/hooks";
import CommitDetailsCard from "../CommitDetailsCard";
import { useTaskHistoryContext } from "../context";
import { TaskHistoryOptions, TaskHistoryTask } from "../types";

interface Props {
  defaultOpen?: boolean;
  inactiveTasks: TaskHistoryTask[];
}
const InactiveCommitsButton: React.FC<Props> = ({
  defaultOpen = false,
  inactiveTasks,
}) => {
  const { expandedTasksMap, setExpandedTasksMap } = useTaskHistoryContext();
  const [failingTest] = useQueryParam<string>(
    TaskHistoryOptions.FailingTest,
    "",
  );
  const [isExpanded, setIsExpanded] = useState(defaultOpen);
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
          onClick={() => {
            const newMap = new Map(expandedTasksMap);
            inactiveTasks.forEach((i) => {
              if (isExpanded) {
                newMap.delete(i.id);
              } else {
                newMap.set(i.id, true);
              }
            });
            setExpandedTasksMap(newMap);
            setIsExpanded(!isExpanded);
          }}
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
            isMatching={!failingTest}
            task={inactiveTask}
          />
        ))}
    </>
  );
};

export default InactiveCommitsButton;
