import { Virtuoso } from "react-virtuoso";
import { TaskStatusCheckbox } from "./TaskStatusCheckbox";

interface TaskStatusCheckboxContainerProps {
  selectedTasks: Set<string>;
  tasks: {
    id: string;
    baseStatus?: string;
    displayName: string;
    displayStatus: string;
  }[];
  toggleSelectedTask: (taskId: string) => void;
}
export const TaskStatusCheckboxContainer: React.FC<
  TaskStatusCheckboxContainerProps
> = ({ selectedTasks, tasks, toggleSelectedTask }) => {
  const possibleListHeight = tasks.length * itemSize;
  const listHeight =
    possibleListHeight < maxListHeight ? possibleListHeight : maxListHeight;

  return (
    <Virtuoso
      data={tasks}
      itemContent={(_idx, task) => {
        const { baseStatus, displayName, displayStatus, id: taskId } = task;
        const checked = selectedTasks.has(taskId);
        return (
          <TaskStatusCheckbox
            key={taskId}
            baseStatus={baseStatus}
            checked={checked}
            displayName={displayName}
            onClick={() => {
              toggleSelectedTask(taskId);
            }}
            status={displayStatus}
            taskId={taskId}
          />
        );
      }}
      style={{ height: listHeight, width: "100%" }}
      totalCount={tasks.length}
    />
  );
};

const itemSize = 20;
const maxListHeight = 250;
