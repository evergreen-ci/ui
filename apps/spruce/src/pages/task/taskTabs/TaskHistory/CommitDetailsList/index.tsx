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
  addVisibleInactiveTasks: (tasks: string[]) => void;
  removeVisibleInactiveTasks: (tasks: string[]) => void;
  visibleInactiveTasks: string[][];
  shouldCollapse: boolean;
}

const CommitDetailsList: React.FC<CommitDetailsListProps> = ({
  addVisibleInactiveTasks,
  currentTask,
  loading,
  removeVisibleInactiveTasks,
  shouldCollapse,
  tasks,
  visibleInactiveTasks,
}) => (
  <CommitList data-cy="commit-details-list">
    {loading ? (
      <ParagraphSkeleton />
    ) : (
      <>
        {tasks.map((t, i, taskArr) => {
          const { inactiveTasks, task } = t;
          if (task) {
            const inactiveTaskGroup =
              visibleInactiveTasks.find((taskGroup) =>
                taskGroup.includes(task.id),
              ) ?? [];
            const showButton =
              shouldCollapse &&
              ((i > 0 && !task.activated && taskArr[i - 1].task?.activated) || // Show toggle button if an uncollapsed inactive task follows an activated task
                (i === 0 &&
                  !task.activated &&
                  inactiveTaskGroup?.[0] === task.id)); // Show toggle button if the first inactive task is overflow from a prior inactive task group
            return (
              <>
                <div>
                  {showButton && (
                    <Button
                      key={`${task.id}-button`}
                      leftGlyph={<Icon glyph="ChevronDown" />}
                      onClick={() =>
                        removeVisibleInactiveTasks(inactiveTaskGroup)
                      }
                      size={Size.XSmall}
                    >
                      {inactiveTaskGroup?.length} EXPANDED
                    </Button>
                  )}
                </div>
                <CommitDetailsCard
                  key={task.id}
                  isCurrentTask={task.id === currentTask.id}
                  owner={currentTask.project?.owner}
                  repo={currentTask.project?.repo}
                  task={task}
                />
              </>
            );
          } else if (inactiveTasks) {
            return (
              <span key={inactiveTasks[0].id}>
                <Button
                  data-cy="collapsed-card"
                  leftGlyph={<Icon glyph="ChevronRight" />}
                  onClick={() =>
                    addVisibleInactiveTasks(inactiveTasks.map(({ id }) => id))
                  }
                  size={Size.XSmall}
                >
                  {inactiveTasks.length} INACTIVE COMMITS
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
