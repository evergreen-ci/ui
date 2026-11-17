import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useQueryVariables } from "../Tabs/useQueryVariables";
import {
  EMPTY_SELECTION,
  SelectedMode,
  SelectionState,
  getSelectedCount,
  toggleTask,
} from "./utils";

interface TaskSelectionContextState {
  clearSelection: () => void;
  isSelected: (taskId: string) => boolean;
  selectedCount: number;
  taskSelection: SelectionState | null;
  toggleAll: (filteredCount: number) => void;
  toggleRow: (taskId: string, filteredCount: number) => void;
}

const TaskSelectionContext = createContext<TaskSelectionContextState | null>(
  null,
);

interface TaskSelectionProviderProps {
  children: React.ReactNode;
  versionId: string;
}

const TaskSelectionProvider: React.FC<TaskSelectionProviderProps> = ({
  children,
  versionId,
}) => {
  const {
    baseStatuses,
    includeNeverActivatedTasks,
    statuses,
    taskName,
    variant,
  } = useQueryVariables(versionId).taskFilterOptions;

  const [state, setState] = useState({
    selectedCount: 0,
    selectionState: EMPTY_SELECTION,
  });
  const { selectedCount, selectionState } = state;

  const clearSelection = useCallback(
    () =>
      setState({
        selectedCount: 0,
        selectionState: EMPTY_SELECTION,
      }),
    [],
  );

  const isSelected = useCallback(
    (taskId: string) =>
      selectionState.mode === SelectedMode.Include
        ? selectionState.taskIds.has(taskId)
        : !selectionState.excludedIds.has(taskId),
    [selectionState],
  );

  const toggleRow = useCallback((taskId: string, filteredCount: number) => {
    setState((prev) => {
      const nextSelectionState = toggleTask(prev.selectionState, taskId);
      return {
        selectedCount: getSelectedCount(nextSelectionState, filteredCount),
        selectionState: nextSelectionState,
      };
    });
  }, []);

  const toggleAll = useCallback(
    (filteredCount: number) => {
      if (filteredCount === 0) {
        return;
      }
      const isEverythingSelected =
        getSelectedCount(state.selectionState, filteredCount) === filteredCount;
      if (isEverythingSelected) {
        setState({ selectedCount: 0, selectionState: EMPTY_SELECTION });
      } else {
        setState({
          selectedCount: filteredCount,
          selectionState: {
            mode: SelectedMode.All,
            excludedIds: new Set(),
            filter: {
              baseStatuses,
              includeNeverActivatedTasks,
              statuses,
              taskName: taskName || undefined,
              variant: variant || undefined,
            },
          },
        });
      }
    },
    [
      baseStatuses,
      includeNeverActivatedTasks,
      state.selectionState,
      statuses,
      taskName,
      variant,
    ],
  );

  const taskSelection = selectedCount === 0 ? null : selectionState;

  const value = useMemo(
    () => ({
      clearSelection,
      isSelected,
      selectedCount,
      taskSelection,
      toggleAll,
      toggleRow,
    }),
    [
      clearSelection,
      isSelected,
      selectedCount,
      taskSelection,
      toggleAll,
      toggleRow,
    ],
  );

  return (
    <TaskSelectionContext.Provider value={value}>
      {children}
    </TaskSelectionContext.Provider>
  );
};

const useTaskSelectionContext = () => {
  const context = useContext(TaskSelectionContext);
  if (context === null) {
    throw new Error(
      "useTaskSelectionContext must be used within a TaskSelectionProvider",
    );
  }
  return context;
};

export { TaskSelectionProvider, useTaskSelectionContext };
