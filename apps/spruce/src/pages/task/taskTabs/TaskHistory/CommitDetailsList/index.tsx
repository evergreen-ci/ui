import styled from "@emotion/styled";
import { ParagraphSkeleton } from "@leafygreen-ui/skeleton-loader";
import { size } from "@evg-ui/lib/constants/tokens";
import { TaskQuery } from "gql/generated/types";
import CommitDetailsCard from "../CommitDetailsCard";
import InactiveCommitsButton from "../InactiveCommitsButton";
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
          const { inactiveTasks, task } = t;

          let shouldShowDateSeparator = false;
          if (i === 0) {
            shouldShowDateSeparator = true;
          } else if (task) {
            const prevGroupedTask = extractTask(tasks[i - 1]);
            shouldShowDateSeparator = !areDatesOnSameDay(
              prevGroupedTask?.createTime,
              t.task.createTime,
            );
          } else if (inactiveTasks) {
            const prevGroupedTask = extractTask(tasks[i - 1]);
            shouldShowDateSeparator = !areDatesOnSameDay(
              prevGroupedTask?.createTime,
              t.inactiveTasks[0].createTime,
            );
          }
          if (task) {
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
