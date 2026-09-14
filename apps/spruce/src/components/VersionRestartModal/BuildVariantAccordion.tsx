import { Badge } from "@leafygreen-ui/badge";
import { Checkbox } from "@leafygreen-ui/checkbox";
import Accordion from "@evg-ui/lib/components/Accordion";
import styles from "./BuildVariantAccordion.module.css";
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
        data-testid="variant-checkbox-select-all"
        indeterminate={matchingTasks > 0 && matchingTasks !== taskLength}
        label={displayName}
        onChange={() =>
          toggleSelectedTask(
            tasks.map((task) => task.id),
            true,
          )
        }
      />
      <div className={styles.badgeWrapper}>
        <Badge data-testid="task-status-badge">
          {matchingTasks} of {taskLength} Selected
        </Badge>
      </div>
    </>
  );
  return (
    <div className={styles.wrapper} data-testid="variant-accordion">
      <Accordion title={variantTitle} titleTag={FlexContainer}>
        <TaskStatusCheckboxContainer
          selectedTasks={selectedTasks}
          tasks={tasks}
          toggleSelectedTask={(taskId: string) =>
            toggleSelectedTask([taskId], false)
          }
        />
      </Accordion>
    </div>
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

const FlexContainer: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => <div className={styles.flexContainer}>{children}</div>;
