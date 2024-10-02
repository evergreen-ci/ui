import styled from "@emotion/styled";
import Card from "@leafygreen-ui/card";
import { Body } from "@leafygreen-ui/typography";
import pluralize from "pluralize";
import TaskStatusBadge from "@evg-ui/lib/components/Badge/TaskStatusBadge";
import { size } from "@evg-ui/lib/constants/tokens";
import { Accordion } from "components/Accordion";
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

  return (
    <Accordion
      shouldRenderChildIfHidden={false}
      title={
        <TitleContainer>
          <Body weight="medium">
            {testName} failed on {tasks.length}{" "}
            {pluralize("task", tasks.length)}
          </Body>
          {Object.entries(statusMap).map(([status, count]) => (
            <TaskStatusBadge key={status} status={status} taskCount={count} />
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
  justify-content: space-between;
  gap: ${size.xs};
  align-items: center;
`;
const StyledCard = styled(Card)`
  margin-top: ${size.xs};
`;
export default FailedTestGroup;
