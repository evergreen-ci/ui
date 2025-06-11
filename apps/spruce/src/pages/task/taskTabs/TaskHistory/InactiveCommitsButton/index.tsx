import { useState } from "react";
import Button from "@leafygreen-ui/button";
import Icon from "@leafygreen-ui/icon";
import { Size } from "@leafygreen-ui/tokens";
import pluralize from "pluralize";
import { useQueryParam } from "hooks/useQueryParam";
import CommitDetailsCard from "../CommitDetailsCard";
import { TaskHistoryOptions, TaskHistoryTask } from "../types";

interface Props {
  inactiveTasks: TaskHistoryTask[];
}
const InactiveCommitsButton: React.FC<Props> = ({ inactiveTasks }) => {
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
            isMatching={!failingTest}
            task={inactiveTask}
          />
        ))}
    </>
  );
};

export default InactiveCommitsButton;
