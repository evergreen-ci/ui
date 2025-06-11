import { createContext, useContext, useMemo, useState } from "react";
import { TaskQuery } from "gql/generated/types";

type TaskHistoryContextState = {
  selectedTask: string | null;
  hoveredTask: string | null;
  setSelectedTask: (v: string | null) => void;
  setHoveredTask: (v: string | null) => void;
  currentTask: NonNullable<TaskQuery["task"]>;
  expandedMap: Map<string, boolean>;
  setExpandedMap: (v: Map<string, boolean>) => void;
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
  task: NonNullable<TaskQuery["task"]>;
  children: React.ReactNode;
}> = ({ children, task }) => {
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [hoveredTask, setHoveredTask] = useState<string | null>(null);
  const [expandedMap, setExpandedMap] = useState(new Map<string, boolean>());

  const memoizedContext = useMemo(
    () => ({
      selectedTask,
      setSelectedTask,
      hoveredTask,
      setHoveredTask,
      currentTask: task,
      expandedMap,
      setExpandedMap,
    }),
    [
      selectedTask,
      setSelectedTask,
      hoveredTask,
      setHoveredTask,
      task,
      expandedMap,
      setExpandedMap,
    ],
  );
  return (
    <TaskHistoryContext.Provider value={memoizedContext}>
      {children}
    </TaskHistoryContext.Provider>
  );
};

export { TaskHistoryContextProvider, useTaskHistoryContext };
