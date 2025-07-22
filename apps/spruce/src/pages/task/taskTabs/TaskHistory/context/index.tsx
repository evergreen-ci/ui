import { createContext, useContext, useMemo, useState } from "react";
import { TaskQuery } from "gql/generated/types";

type TaskHistoryContextState = {
  selectedTask: string | null;
  hoveredTask: string | null;
  setSelectedTask: (v: string | null) => void;
  setHoveredTask: (v: string | null) => void;
  currentTask: NonNullable<TaskQuery["task"]>;
  expandedTasksMap: Map<string, boolean>;
  setExpandedTasksMap: (v: Map<string, boolean>) => void;
  baseTaskId: string;
  isPatch: boolean;
};

const TaskHistoryContext = createContext<TaskHistoryContextState | null>(null);

const useTaskHistoryContext = () => {
  const context = useContext(TaskHistoryContext);
  if (context === undefined) {
    throw new Error(
      "useTaskHistoryContext must be used within a TaskHistoryContextProvider",
    );
  }
  return context as TaskHistoryContextState;
};

const TaskHistoryContextProvider: React.FC<{
  baseTaskId: string;
  children: React.ReactNode;
  isPatch: boolean;
  task: NonNullable<TaskQuery["task"]>;
}> = ({ baseTaskId, children, isPatch, task }) => {
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [hoveredTask, setHoveredTask] = useState<string | null>(null);
  const [expandedTasksMap, setExpandedTasksMap] = useState(
    new Map<string, boolean>(),
  );

  const memoizedContext = useMemo(
    () => ({
      selectedTask,
      setSelectedTask,
      hoveredTask,
      setHoveredTask,
      expandedTasksMap,
      setExpandedTasksMap,
      currentTask: task,
      baseTaskId,
      isPatch,
    }),
    [
      selectedTask,
      setSelectedTask,
      hoveredTask,
      setHoveredTask,
      expandedTasksMap,
      setExpandedTasksMap,
      task,
      baseTaskId,
      isPatch,
    ],
  );
  return (
    <TaskHistoryContext.Provider value={memoizedContext}>
      {children}
    </TaskHistoryContext.Provider>
  );
};

export { TaskHistoryContextProvider, useTaskHistoryContext };
