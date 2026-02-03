import styled from "@emotion/styled";
import { Badge } from "@leafygreen-ui/badge";
import { Checkbox } from "@leafygreen-ui/checkbox";
import { Accordion } from "@evg-ui/lib/components";
import { size } from "@evg-ui/lib/constants";
import { TaskStatusCheckboxContainer } from "./TaskStatusCheckboxContainer";

interface BuildVariantAccordionProps {
  displayName: string;
  selectedTasks: Set<string>;
  tasks: {
    id: string;
    baseStatus?: string;
    displayName: string;
    displayStatus: string;
  }[];
  toggleSelectedTask: (taskIds: string[], isParentCheckbox: boolean) => void;
}
export const BuildVariantAccordion: React.FC<BuildVariantAccordionProps> = ({
  displayName,
  selectedTasks,
  tasks,
  toggleSelectedTask,
}) => {
  const taskLength = tasks.length;
  const matchingTasks = countMatchingTasks(tasks, selectedTasks);
  const variantTitle = (
    <>
      <Checkbox
        bold
        checked={matchingTasks === taskLength}
        data-cy="variant-checkbox-select-all"
        indeterminate={matchingTasks > 0 && matchingTasks !== taskLength}
        label={displayName}
        onChange={() =>
          toggleSelectedTask(
            tasks.map((task) => task.id),
            true,
          )
        }
      />
      <BadgeWrapper>
        <Badge data-cy="task-status-badge">
          {matchingTasks} of {taskLength} Selected
        </Badge>
      </BadgeWrapper>
    </>
  );
  return (
    <Wrapper data-cy="variant-accordion">
      <Accordion title={variantTitle} titleTag={FlexContainer}>
        <TaskStatusCheckboxContainer
          selectedTasks={selectedTasks}
          tasks={tasks}
          toggleSelectedTask={(taskId: string) =>
            toggleSelectedTask([taskId], false)
          }
        />
      </Accordion>
    </Wrapper>
  );
};

const countMatchingTasks = (
  tasks: { id: string }[],
  selectedTasks: Set<string>,
): number => {
  let matchingTasks = 0;
  tasks.forEach((task) => {
    if (selectedTasks.has(task.id)) {
      matchingTasks += 1;
    }
  });
  return matchingTasks;
};

const BadgeWrapper = styled.div`
  padding-left: ${size.xs};
  flex-shrink: 0;
`;

const Wrapper = styled.div`
  margin: ${size.xs} 0;
`;

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
`;
