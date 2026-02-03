import { useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  ColumnFiltering,
  ColumnFiltersState,
  RowSorting,
  SortingState,
  LeafyGreenTable,
  useLeafyGreenTable,
  BaseTable,
  TableWrapper,
  onChangeHandler,
  TableControl,
  TablePlaceholder,
} from "@evg-ui/lib/components";
import { usePatchAnalytics, useVersionAnalytics } from "analytics";
import { getColumnsTemplate } from "components/TasksTable/Columns";
import { TaskTableInfo } from "components/TasksTable/types";
import { slugs } from "constants/routes";
import { SortDirection, TaskSortCategory } from "gql/generated/types";
import { useTaskStatuses } from "hooks";
import { Action } from "../state";

const { getDefaultOptions: getDefaultFiltering } = ColumnFiltering;
const { getDefaultOptions: getDefaultSorting } = RowSorting;

interface DownstreamTasksTableProps {
  childPatchId: string;
  count: number;
  dispatch: (action: Action) => void;
  isPatch?: boolean;
  limit: number;
  loading: boolean;
  page: number;
  taskCount: number;
  tasks: TaskTableInfo[];
}

const DownstreamTasksTable: React.FC<DownstreamTasksTableProps> = ({
  childPatchId,
  count,
  dispatch,
  isPatch,
  limit,
  loading,
  page,
  taskCount,
  tasks,
}) => {
  const { [slugs.versionId]: versionId } = useParams<{
    [slugs.versionId]: string;
  }>();
  const { sendEvent: sendPatchEvent } = usePatchAnalytics(
    isPatch === true && versionId ? versionId : "",
  );
  const { sendEvent: sendVersionEvent } = useVersionAnalytics(
    isPatch === false && versionId ? versionId : "",
  );

  const sendEvent = isPatch ? sendPatchEvent : sendVersionEvent;

  const { baseStatuses: baseStatusOptions, currentStatuses: statusOptions } =
    useTaskStatuses({ versionId: childPatchId });

  const onFilterChange = (filterState: ColumnFiltersState) => {
    filterState.forEach(({ id, value }) => {
      if (id === TaskSortCategory.Name) {
        dispatch({ type: "setTaskName", task: value as string });
      } else if (id === TaskSortCategory.Status) {
        dispatch({ type: "setStatuses", statuses: value as string[] });
      } else if (id === TaskSortCategory.BaseStatus) {
        dispatch({ type: "setBaseStatuses", baseStatuses: value as string[] });
      } else if (id === TaskSortCategory.Variant) {
        dispatch({ type: "setVariant", variant: value as string });
      }
    });
    sendEvent({
      name: "Filtered downstream tasks table",
      "filter.by": Object.keys(filterState),
    });
  };

  const onSortingChange = (sortingState: SortingState) => {
    const updatedSorts = sortingState.map(({ desc, id }) => ({
      Key: id as TaskSortCategory,
      Direction: desc ? SortDirection.Desc : SortDirection.Asc,
    }));
    dispatch({ type: "setSorts", sorts: updatedSorts });
    sendEvent({
      name: "Sorted downstream tasks table",
      "sort.by": sortingState.map(({ id }) => id as TaskSortCategory),
    });
  };

  const columns = useMemo(
    () =>
      getColumnsTemplate({
        baseStatusOptions,
        statusOptions,
        isPatch,
      }),
    [baseStatusOptions, statusOptions, isPatch],
  );

  const table: LeafyGreenTable<TaskTableInfo> =
    useLeafyGreenTable<TaskTableInfo>({
      columns,
      data: tasks ?? [],
      defaultColumn: {
        enableMultiSort: true,
        sortDescFirst: false, // Handle bug in sorting order (https://github.com/TanStack/table/issues/4289)
      },
      initialState: {
        sorting: [
          { id: TaskSortCategory.Status, desc: false },
          { id: TaskSortCategory.BaseStatus, desc: true },
        ],
      },
      isMultiSortEvent: () => true, // Override default requirement for shift-click to multisort.
      maxMultiSortColCount: 2,
      manualFiltering: true,
      manualPagination: true,
      manualSorting: true,
      onColumnFiltersChange: onChangeHandler<ColumnFiltersState>(
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        (f) => getDefaultFiltering(table).onColumnFiltersChange(f),
        onFilterChange,
      ),
      onSortingChange: onChangeHandler<SortingState>(
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        (s) => getDefaultSorting(table).onSortingChange(s),
        onSortingChange,
      ),
      getSubRows: (row) => row.executionTasksFull || [],
    });

  return (
    <TableWrapper
      controls={
        <TableControl
          filteredCount={count}
          label="tasks"
          limit={limit}
          onClear={() => {
            dispatch({ type: "clearAllFilters" });
            table.reset();
          }}
          onPageChange={(p: number) => dispatch({ type: "setPage", page: p })}
          onPageSizeChange={(l: number) =>
            dispatch({ type: "setLimit", limit: l })
          }
          page={page}
          totalCount={taskCount}
        />
      }
    >
      <BaseTable
        data-cy="downstream-tasks-table"
        data-cy-row="downstream-tasks-table-row"
        emptyComponent={<TablePlaceholder message="No tasks found." />}
        loading={loading}
        shouldAlternateRowColor
        table={table}
      />
    </TableWrapper>
  );
};

export default DownstreamTasksTable;
