import styled from "@emotion/styled";
import { ParagraphSkeleton } from "@leafygreen-ui/skeleton-loader";
import { size } from "@evg-ui/lib/constants/tokens";
import CommitDetailsCard from "../CommitDetailsCard";
import { stickyHeaderScrollOffset } from "../constants";
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
}) => (
  <CommitList data-cy="commit-details-list">
    {loading ? (
      <ParagraphSkeleton />
    ) : (
      <>
        {tasks.map((t) => {
          const {
            commitCardRef,
            inactiveTasks,
            isMatching,
            shouldShowDateSeparator,
            task,
          } = t;
          if (task) {
            return (
              <>
                {shouldShowDateSeparator && (
                  <DateSeparator date={task.createTime} />
                )}
                <CommitDetailsCard
                  key={task.id}
                  ref={commitCardRef}
                  isMatching={isMatching}
                  task={task}
                />
              </>
            );
          } else if (inactiveTasks) {
            return (
              <>
                {shouldShowDateSeparator && (
                  <DateSeparator date={inactiveTasks[0].createTime} />
                )}
                <InactiveCommitsButton
                  key={`${inactiveTasks[0].id}-${inactiveTasks[inactiveTasks.length - 1].id}`}
                  inactiveTasks={inactiveTasks}
                />
              </>
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

  padding-top: ${stickyHeaderScrollOffset}px;
  margin-top: -${stickyHeaderScrollOffset}px;
`;
