import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import Icon from "@leafygreen-ui/icon";
import { ParagraphSkeleton } from "@leafygreen-ui/skeleton-loader";
import { Size } from "@leafygreen-ui/tokens";
import { size } from "@evg-ui/lib/constants/tokens";
import { TaskQuery } from "gql/generated/types";
import CommitDetailsCard from "../CommitDetailsCard";
import { GroupedTask } from "../types";

interface CommitDetailsListProps {
  currentTask: NonNullable<TaskQuery["task"]>;
  tasks: GroupedTask[];
  loading: boolean;
  addVisibleInactiveTaskGroup: (taskId: string) => void;
  removeVisibleInactiveTaskGroup: (taskId: string) => void;
  visibleInactiveTasks: Set<string>;
  shouldCollapse: boolean;
}

const CommitDetailsList: React.FC<CommitDetailsListProps> = ({
  addVisibleInactiveTaskGroup,
  currentTask,
  loading,
  removeVisibleInactiveTaskGroup,
  shouldCollapse,
  tasks,
  visibleInactiveTasks,
}) => (
  <CommitList data-cy="commit-details-list">
    {loading ? (
      <ParagraphSkeleton />
    ) : (
      <>
        {tasks.map((t) => {
          const { inactiveTasks, task } = t;
          if (task) {
            return (
              <CommitDetailsCard
                key={task.id}
                isCurrentTask={task.id === currentTask.id}
                owner={currentTask.project?.owner}
                repo={currentTask.project?.repo}
                task={task}
              />
            );
          } else if (inactiveTasks && shouldCollapse) {
            const taskGroupId = inactiveTasks[0].id;
            const expanded = visibleInactiveTasks.has(taskGroupId);
            return (
              <span key={taskGroupId}>
                <Button
                  data-cy="collapsed-card"
                  leftGlyph={
                    expanded ? (
                      <Icon glyph="ChevronDown" />
                    ) : (
                      <Icon glyph="ChevronRight" />
                    )
                  }
                  onClick={() =>
                    expanded
                      ? removeVisibleInactiveTaskGroup(taskGroupId)
                      : addVisibleInactiveTaskGroup(taskGroupId)
                  }
                  size={Size.XSmall}
                >
                  {inactiveTasks.length}{" "}
                  {expanded ? "EXPANDED" : "INACTIVE COMMITS"}
                </Button>
              </span>
            );
          }
          return null;
        })}
      </>
    )}
  </CommitList>
);

export default CommitDetailsList;

const CommitList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${size.xs};
  overflow-y: scroll;
`;
