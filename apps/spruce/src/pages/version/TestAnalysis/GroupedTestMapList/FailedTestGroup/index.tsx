import styled from "@emotion/styled";
import Card from "@leafygreen-ui/card";
import TaskStatusBadge from "@evg-ui/lib/components/Badge/TaskStatusBadge";
import { size } from "@evg-ui/lib/constants/tokens";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { Accordion } from "components/Accordion";
import { trimStringFromMiddle } from "utils/string";
import { TaskBuildVariantField } from "../../types";
import FailedTestGroupTable from "./FailedTestGroupTable";

interface FailedTestGroupProps {
  testName: string;
  tasks: TaskBuildVariantField[];
}

const FailedTestGroup: React.FC<FailedTestGroupProps> = ({
  tasks,
  testName,
}) => {
  const statusMap = countStatuses(tasks);
  const sortedStatuses = Object.entries(statusMap).sort((a, b) =>
    a[0].localeCompare(b[0]),
  );
  return (
    <Accordion
      caretAlignSelf="start"
      shouldRenderChildIfHidden={false}
      title={
        <TitleContainer>
          <Title title={testName}>{trimStringFromMiddle(testName, 90)}</Title>
          {sortedStatuses.map(([status, count]) => (
            <TaskStatusBadge
              key={status}
              status={status as TaskStatus}
              taskCount={count}
            />
          ))}
        </TitleContainer>
      }
      toggledTitle={
        <TitleContainer>
          <Title>{testName}</Title>
          {sortedStatuses.map(([status, count]) => (
            <TaskStatusBadge
              key={status}
              status={status as TaskStatus}
              taskCount={count}
            />
          ))}
        </TitleContainer>
      }
    >
      <StyledCard>
        <FailedTestGroupTable tasks={tasks} />
      </StyledCard>
    </Accordion>
  );
};

/**
 * `countStatuses` counts the number of tasks with each status
 * @param tasks - list of tasks
 * @returns - object with status as key and count as value
 */
const countStatuses = (tasks: TaskBuildVariantField[]) => {
  const statuses = tasks.reduce(
    (acc, task) => {
      const { status } = task;
      if (acc[status]) {
        acc[status] += 1;
      } else {
        acc[status] = 1;
      }
      return acc;
    },
    {} as Record<string, number>,
  );
  return statuses;
};

const TitleContainer = styled.div`
  display: flex;
  gap: ${size.xs};
  align-items: flex-start;
  width: 100%;
`;
const StyledCard = styled(Card)`
  margin-top: ${size.xs};
`;

const Title = styled.div`
  display: inline-block;
  max-width: 60vw;
  overflow: hidden;
  word-break: break-all;
`;

export default FailedTestGroup;
