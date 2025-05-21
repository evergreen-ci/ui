import styled from "@emotion/styled";
import { ParagraphSkeleton } from "@leafygreen-ui/skeleton-loader";
import { size } from "@evg-ui/lib/constants/tokens";
import { TaskQuery } from "gql/generated/types";
import CommitDetailsCard from "../CommitDetailsCard";
import InactiveCommitsButton from "../InactiveCommitsButton";
import { GroupedTask } from "../types";

interface CommitDetailsListProps {
  currentTask: NonNullable<TaskQuery["task"]>;
  tasks: GroupedTask[];
  loading: boolean;
}

const CommitDetailsList: React.FC<CommitDetailsListProps> = ({
  currentTask,
  loading,
  tasks,
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
                isMatching={t.isMatching}
                owner={currentTask.project?.owner}
                repo={currentTask.project?.repo}
                task={task}
              />
            );
          } else if (inactiveTasks) {
            return (
              <InactiveCommitsButton
                key={`${inactiveTasks[0].id}-${inactiveTasks[inactiveTasks.length - 1].id}`}
                currentTask={currentTask}
                inactiveTasks={inactiveTasks}
              />
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
