import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { RowSelectionState } from "@evg-ui/lib/components/Table";
import { useQueryVariables } from "../Tabs/useQueryVariables";
import {
  EMPTY_SELECTION,
  SelectedMode,
  SelectionState,
  getSelectedCount,
  getTableRowSelection,
  isTaskSelected,
  toggleTask,
} from "./utils";

type RowSelectionUpdater =
  | RowSelectionState
  | ((old: RowSelectionState) => RowSelectionState);

interface TaskSelectionContextState {
  clearSelection: () => void;
  getRowSelection: (visibleTaskIds: string[]) => RowSelectionState;
  selectedCount: number;
  setRowSelection: (
    updater: RowSelectionUpdater,
    visibleTaskIds: string[],
    filteredCount: number,
  ) => void;
  taskSelection: SelectionState | null;
  toggleAll: (filteredCount: number) => void;
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

  console.log("CURRENT STATE: ", { state });
  const { selectedCount, selectionState } = state;

  const clearSelection = useCallback(
    () =>
      setState({
        selectedCount: 0,
        selectionState: EMPTY_SELECTION,
      }),
    [],
  );

  // Function that returns the row selection state compatible with LeafyGreen table.
  const getRowSelection = useCallback(
    (visibleTaskIds: string[]) =>
      getTableRowSelection(selectionState, visibleTaskIds),
    [selectionState],
  );

  // Function that updates the row selection state based on user interaction with the LeafyGreen table.
  const setRowSelection = useCallback(
    (
      updater: RowSelectionUpdater,
      visibleTaskIds: string[],
      filteredCount: number,
    ) => {
      const currentRows = getTableRowSelection(
        state.selectionState,
        visibleTaskIds,
      );
      const nextRows =
        typeof updater === "function" ? updater(currentRows) : updater;
      const changedTaskIds = visibleTaskIds.filter(
        (id) =>
          Boolean(nextRows[id]) !== isTaskSelected(state.selectionState, id),
      );
      const nextSelectionState = changedTaskIds.reduce(
        (selection, id) => toggleTask(selection, id),
        state.selectionState,
      );
      setState({
        selectedCount: getSelectedCount(nextSelectionState, filteredCount),
        selectionState: nextSelectionState,
      });
    },
    [state.selectionState],
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
      getRowSelection,
      selectedCount,
      setRowSelection,
      taskSelection,
      toggleAll,
    }),
    [
      clearSelection,
      getRowSelection,
      selectedCount,
      setRowSelection,
      taskSelection,
      toggleAll,
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
