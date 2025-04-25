import styled from "@emotion/styled";
import { ParagraphSkeleton } from "@leafygreen-ui/skeleton-loader";
import { size } from "@evg-ui/lib/constants/tokens";
import { TaskQuery } from "gql/generated/types";
import CommitDetailsCard from "../CommitDetailsCard";
import { GroupedTask } from "../types";
import { areDatesOnSameDay, extractTask } from "../utils";
import DateSeparator from "./DateSeparator";

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
        {tasks.map((t, i) => {
          let shouldShowDateSeparator = false;
          if (i === 0) {
            shouldShowDateSeparator = true;
          } else if (t.task) {
            const prevGroupedTask = extractTask(tasks[i - 1]);
            shouldShowDateSeparator = !areDatesOnSameDay(
              prevGroupedTask?.createTime,
              t.task.createTime,
            );
          } else if (t.inactiveTasks) {
            const prevGroupedTask = extractTask(tasks[i - 1]);
            shouldShowDateSeparator = !areDatesOnSameDay(
              prevGroupedTask?.createTime,
              t.inactiveTasks[0].createTime,
            );
          }
          if (t.task) {
            const { task } = t;
            return (
              <>
                {shouldShowDateSeparator && (
                  <DateSeparator date={task.createTime} />
                )}
                <CommitDetailsCard
                  key={task.id}
                  isCurrentTask={task.id === currentTask.id}
                  owner={currentTask.project?.owner}
                  repo={currentTask.project?.repo}
                  task={task}
                />
              </>
            );
          } else if (t.inactiveTasks) {
            // TODO DEVPROD-16174: Replace with Inactive Commits Button.
            return (
              <span key={t.inactiveTasks[0].id} data-cy="collapsed-card">
                {t.inactiveTasks.length} Collapsed
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
