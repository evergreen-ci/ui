import { useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  BaseTable,
  ColumnFiltering,
  ColumnFiltersState,
  LeafyGreenTable,
  onChangeHandler,
  RowSorting,
  SortingState,
  TableControl,
  TableWrapper,
  useLeafyGreenTable,
} from "@evg-ui/lib/components/Table";
import { TablePlaceholder } from "@evg-ui/lib/components/Table/TablePlaceholder";
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
        dispatch({ task: value as string, type: "setTaskName" });
      } else if (id === TaskSortCategory.Status) {
        dispatch({ statuses: value as string[], type: "setStatuses" });
      } else if (id === TaskSortCategory.BaseStatus) {
        dispatch({ baseStatuses: value as string[], type: "setBaseStatuses" });
      } else if (id === TaskSortCategory.Variant) {
        dispatch({ type: "setVariant", variant: value as string });
      }
    });
    sendEvent({
      "filter.by": Object.keys(filterState),
      name: "Filtered downstream tasks table",
    });
  };

  const onSortingChange = (sortingState: SortingState) => {
    const updatedSorts = sortingState.map(({ desc, id }) => ({
      Direction: desc ? SortDirection.Desc : SortDirection.Asc,
      Key: id as TaskSortCategory,
    }));
    dispatch({ sorts: updatedSorts, type: "setSorts" });
    sendEvent({
      name: "Sorted downstream tasks table",
      "sort.by": sortingState.map(({ id }) => id as TaskSortCategory),
    });
  };

  const columns = useMemo(
    () =>
      getColumnsTemplate({
        baseStatusOptions,
        isPatch,
        statusOptions,
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
      getSubRows: (row) => row.executionTasksFull || [],
      initialState: {
        sorting: [
          { desc: false, id: TaskSortCategory.Status },
          { desc: true, id: TaskSortCategory.BaseStatus },
        ],
      },
      isMultiSortEvent: () => true, // Override default requirement for shift-click to multisort.
      manualFiltering: true,
      manualPagination: true,
      manualSorting: true,
      maxMultiSortColCount: 2,
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
          onPageChange={(p: number) => dispatch({ page: p, type: "setPage" })}
          onPageSizeChange={(l: number) =>
            dispatch({ limit: l, type: "setLimit" })
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
