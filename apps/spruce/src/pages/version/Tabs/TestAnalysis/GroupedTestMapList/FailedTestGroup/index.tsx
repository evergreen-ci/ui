import styled from "@emotion/styled";
import { Card } from "@leafygreen-ui/card";
import {
  Accordion,
  AccordionCaretAlign,
  TaskStatusBadge,
} from "@evg-ui/lib/components";
import { size } from "@evg-ui/lib/constants";
import { TaskStatus } from "@evg-ui/lib/types";
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
      caretAlign={AccordionCaretAlign.Start}
      title={
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
      const { displayStatus } = task;
      if (acc[displayStatus]) {
        acc[displayStatus] += 1;
      } else {
        acc[displayStatus] = 1;
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
  margin: ${size.xs} 0;
`;

const Title = styled.div`
  display: inline-block;
  max-width: 60vw;
  overflow: hidden;
  word-break: break-all;
`;

export default FailedTestGroup;
