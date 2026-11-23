import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { TaskFilterOptions } from "gql/generated/types";
import { useQueryVariables } from "../Tabs/useQueryVariables";

enum SelectedMode {
  Include = "include",
  All = "all",
}

/**
 * "include" (SelectedMode.Include) tracks hand-picked task IDs.
 * "all" (SelectedMode.All) selects every task matching the current filter (for all pages) minus the deselected tasks.
 */
type SelectionState =
  | { mode: SelectedMode.Include; taskIds: ReadonlySet<string> }
  | {
      mode: SelectedMode.All;
      excludedIds: ReadonlySet<string>;
      filter: TaskFilterOptions;
    };

const EMPTY_SELECTION: SelectionState = {
  mode: SelectedMode.Include,
  taskIds: new Set(),
};

const toggleTask = (state: SelectionState, taskId: string): SelectionState => {
  if (state.mode === SelectedMode.Include) {
    const taskIds = new Set(state.taskIds);
    if (taskIds.has(taskId)) {
      taskIds.delete(taskId);
    } else {
      taskIds.add(taskId);
    }
    return { mode: SelectedMode.Include, taskIds };
  }
  const excludedIds = new Set(state.excludedIds);
  if (excludedIds.has(taskId)) {
    excludedIds.delete(taskId);
  } else {
    excludedIds.add(taskId);
  }
  return { ...state, excludedIds };
};

const getSelectedCount = (state: SelectionState, filteredCount: number) =>
  state.mode === SelectedMode.Include
    ? state.taskIds.size
    : Math.max(filteredCount - state.excludedIds.size, 0);

interface TaskSelectionContextState {
  clearSelection: () => void;
  isSelected: (taskId: string) => boolean;
  selectedCount: number;
  taskSelection: SelectionState | null;
  toggleAll: (filteredCount: number) => void;
  toggleRows: (taskIds: string[], filteredCount: number) => void;
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
  const { taskFilterOptions } = useQueryVariables(versionId);

  const [state, setState] = useState<{
    selectedCount: number;
    selectionState: SelectionState;
  }>({
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

  const toggleRows = useCallback(
    (taskIds: string[], filteredCount: number) => {
      let nextSelectionState = selectionState;
      taskIds.forEach((taskId) => {
        nextSelectionState = toggleTask(nextSelectionState, taskId);
      });
      setState({
        selectedCount: getSelectedCount(nextSelectionState, filteredCount),
        selectionState: nextSelectionState,
      });
    },
    [selectionState],
  );

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
            filter: taskFilterOptions,
          },
        });
      }
    },
    [taskFilterOptions, state.selectionState],
  );

  const taskSelection = selectedCount === 0 ? null : selectionState;

  const value = useMemo(
    () => ({
      clearSelection,
      isSelected,
      selectedCount,
      taskSelection,
      toggleAll,
      toggleRows,
    }),
    [
      clearSelection,
      isSelected,
      selectedCount,
      taskSelection,
      toggleAll,
      toggleRows,
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

export { SelectedMode, TaskSelectionProvider, useTaskSelectionContext };
export type { SelectionState };
