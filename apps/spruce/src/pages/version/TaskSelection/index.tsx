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
      totalCount: number;
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

const getSelectedCount = (state: SelectionState) =>
  state.mode === SelectedMode.Include
    ? state.taskIds.size
    : Math.max(state.totalCount - state.excludedIds.size, 0);

interface TaskSelectionContextState {
  clearSelection: () => void;
  isSelected: (taskId: string) => boolean;
  selectedCount: number;
  taskSelection: SelectionState | null;
  toggleAll: (filteredCount: number) => void;
  toggleRows: (taskIds: string[]) => void;
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

  const [selectionState, setSelectionState] =
    useState<SelectionState>(EMPTY_SELECTION);

  const selectedCount = useMemo(
    () => getSelectedCount(selectionState),
    [selectionState],
  );

  const clearSelection = useCallback(
    () => setSelectionState(EMPTY_SELECTION),
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
    (taskIds: string[]) => {
      let nextSelectionState = selectionState;
      taskIds.forEach((taskId) => {
        nextSelectionState = toggleTask(nextSelectionState, taskId);
      });
      setSelectionState(nextSelectionState);
    },
    [selectionState],
  );

  const toggleAll = useCallback(
    (filteredCount: number) => {
      if (filteredCount === 0) {
        return;
      }
      if (selectedCount === filteredCount) {
        setSelectionState(EMPTY_SELECTION);
      } else {
        setSelectionState({
          mode: SelectedMode.All,
          excludedIds: new Set(),
          filter: taskFilterOptions,
          totalCount: filteredCount,
        });
      }
    },
    [taskFilterOptions, selectedCount],
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
