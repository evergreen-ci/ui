import styled from "@emotion/styled";
import { ParagraphSkeleton } from "@leafygreen-ui/skeleton-loader";
import { size } from "@evg-ui/lib/constants";
import CommitDetailsCard from "../CommitDetailsCard";
import { stickyHeaderScrollOffset } from "../constants";
import { useTaskHistoryContext } from "../context";
import InactiveCommitsButton from "../InactiveCommitsButton";
import { GroupedTask } from "../types";
import DateSeparator from "./DateSeparator";

interface CommitDetailsListProps {
  tasks: GroupedTask[];
  loading: boolean;
}

const CommitDetailsList: React.FC<CommitDetailsListProps> = ({
  loading,
  tasks,
}) => {
  const { expandedTasksMap } = useTaskHistoryContext();

  return (
    <CommitList data-cy="commit-details-list">
      {loading ? (
        <ParagraphSkeleton />
      ) : (
        <>
          {tasks.map((t) => {
            const { commitCardRef, date, inactiveTasks, isMatching, task } = t;
            if (date) {
              return (
                <DateSeparator
                  key={`list-date-separator-${date}`}
                  date={date}
                />
              );
            } else if (task) {
              return (
                <CommitDetailsCard
                  key={task.id}
                  ref={commitCardRef}
                  isMatching={isMatching}
                  task={task}
                />
              );
            } else if (inactiveTasks) {
              return (
                <InactiveCommitsButton
                  key={`${inactiveTasks[0].id}-${inactiveTasks[inactiveTasks.length - 1].id}`}
                  defaultOpen={expandedTasksMap.get(inactiveTasks[0].id)}
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
};

export default CommitDetailsList;

const CommitList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${size.xs};
  overflow-y: scroll;

  padding-top: ${stickyHeaderScrollOffset}px;
  margin-top: -${stickyHeaderScrollOffset}px;
`;
