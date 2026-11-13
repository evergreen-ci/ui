import { RowSelectionState } from "@evg-ui/lib/components/Table";
import { VersionTasksQueryVariables } from "gql/generated/types";

export enum SelectedMode {
  Include = "include",
  All = "all",
}

export type SelectionFilter = Pick<
  VersionTasksQueryVariables["taskFilterOptions"],
  | "baseStatuses"
  | "includeNeverActivatedTasks"
  | "statuses"
  | "taskName"
  | "variant"
>;

/**
 * "include" (SelectedMode.Include) tracks hand-picked task IDs.
 * "all" (SelectedMode.All) selects every task matching the current filter (for all pages) minus the deselected tasks.
 */
export type SelectionState =
  | { mode: SelectedMode.Include; taskIds: ReadonlySet<string> }
  | {
      mode: SelectedMode.All;
      excludedIds: ReadonlySet<string>;
      filter: SelectionFilter;
    };

export const EMPTY_SELECTION: SelectionState = {
  mode: SelectedMode.Include,
  taskIds: new Set(),
};

export const toggleTask = (
  state: SelectionState,
  taskId: string,
): SelectionState => {
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

export const isTaskSelected = (state: SelectionState, taskId: string) =>
  state.mode === SelectedMode.Include
    ? state.taskIds.has(taskId)
    : !state.excludedIds.has(taskId);

export const getTableRowSelection = (
  state: SelectionState,
  taskIds: string[],
): RowSelectionState =>
  Object.fromEntries(
    taskIds.filter((id) => isTaskSelected(state, id)).map((id) => [id, true]),
  );

export const getSelectedCount = (
  state: SelectionState,
  filteredCount: number,
) =>
  state.mode === SelectedMode.Include
    ? state.taskIds.size
    : Math.max(filteredCount - state.excludedIds.size, 0);
