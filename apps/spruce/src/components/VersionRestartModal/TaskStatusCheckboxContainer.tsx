import { Virtuoso } from "react-virtuoso";
import { selectedStrings } from "hooks/useVersionTaskStatusSelect";
import { TaskStatusCheckbox } from "./TaskStatusCheckbox";

interface TaskStatusCheckboxContainerProps {
  selectedTasks: selectedStrings;
  tasks: {
    id: string;
    baseStatus?: string;
    displayName: string;
    displayStatus: string;
  }[];
  toggleSelectedTask: (taskIds: { [patchId: string]: string }) => void;
  versionId: string;
}
export const TaskStatusCheckboxContainer: React.FC<
  TaskStatusCheckboxContainerProps
> = ({ selectedTasks, tasks, toggleSelectedTask, versionId }) => {
  const possibleListHeight = tasks.length * itemSize;
  const listHeight =
    possibleListHeight < maxListHeight ? possibleListHeight : maxListHeight;

  return (
    <Virtuoso
      data={tasks}
      itemContent={(_idx, task) => {
        const { baseStatus, displayName, displayStatus, id: taskId } = task;
        const checked = !!selectedTasks[taskId];
        return (
          <TaskStatusCheckbox
            key={taskId}
            baseStatus={baseStatus}
            checked={checked}
            displayName={displayName}
            onClick={() => {
              if (selectedTasks[taskId] !== undefined) {
                toggleSelectedTask({ [versionId]: taskId });
              }
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
