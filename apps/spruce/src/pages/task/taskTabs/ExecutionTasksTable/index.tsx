import { useEffect, useMemo, useRef } from "react";
import {
  LeafyGreenTable,
  RowSorting,
  SortingState,
  useLeafyGreenTable,
} from "@leafygreen-ui/table";
import { useTaskAnalytics } from "analytics";
import { BaseTable } from "components/Table/BaseTable";
import { TablePlaceholder } from "components/Table/TablePlaceholder";
import { onChangeHandler } from "components/Table/utils";
import { getColumnsTemplate } from "components/TasksTable/Columns";
import { TaskTableInfo } from "components/TasksTable/types";
import { TableQueryParams } from "constants/queryParams";
import {
  TaskQuery,
  TaskSortCategory,
  SortDirection,
} from "gql/generated/types";
import { useTableSort } from "hooks";
import { useQueryParam } from "hooks/useQueryParam";
import { parseSortString, toSortString } from "utils/queryString";

const { getDefaultOptions: getDefaultSorting } = RowSorting;

interface Props {
  execution: number;
  executionTasksFull: NonNullable<TaskQuery["task"]>["executionTasksFull"];
  isPatch: boolean;
}

export const ExecutionTasksTable: React.FC<Props> = ({
  execution,
  executionTasksFull,
  isPatch,
}) => {
  const { sendEvent } = useTaskAnalytics();
  const [sorts, setSorts] = useQueryParam(TableQueryParams.Sorts, "");
  // Apply default sort if no sorting method is defined.
  useEffect(() => {
    if (!sorts) {
      setSorts(defaultSortQueryParam);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const uniqueExecutions = new Set([
    execution,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    ...executionTasksFull.map((t) => t.execution),
  ]);

  const initialSorting = useMemo(
    () => getInitialSorting(sorts),
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const columns = useMemo(
    () =>
      getColumnsTemplate({
        isPatch,
        onClickTaskLink: () =>
          sendEvent({ name: "Clicked execution tasks table link" }),
        showTaskExecutionLabel: uniqueExecutions.size > 1,
      }),
    [isPatch, sendEvent, uniqueExecutions.size],
  );

  const tableSortHandler = useTableSort({
    singleQueryParam: true,
    sendAnalyticsEvents: (sorter: SortingState) =>
      sendEvent({
        name: "Sorted execution tasks table",
        "sort.by": sorter.map(({ id }) => id as TaskSortCategory),
      }),
  });

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const table: LeafyGreenTable<TaskTableInfo> =
    useLeafyGreenTable<TaskTableInfo>({
      columns,
      containerRef: tableContainerRef,
      data: executionTasksFull ?? [],
      defaultColumn: {
        enableColumnFilter: false,
        enableMultiSort: true,
      },
      initialState: {
        sorting: initialSorting,
      },
      isMultiSortEvent: () => true, // Override default requirement for shift-click to multisort.
      maxMultiSortColCount: 2,
      onSortingChange: onChangeHandler<SortingState>(
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        (s) => getDefaultSorting(table).onSortingChange(s),
        tableSortHandler,
      ),
    });

  return (
    <BaseTable
      data-cy="execution-tasks-table"
      data-cy-row="execution-tasks-table-row"
      emptyComponent={<TablePlaceholder message="No execution tasks found." />}
      shouldAlternateRowColor
      table={table}
    />
  );
};

const getInitialSorting = (sorts: string): SortingState => {
  const initialSorting = sorts
    ? parseSortString<
        "id",
        "direction",
        TaskSortCategory,
        {
          id: TaskSortCategory;
          direction: SortDirection;
        }
      >(sorts, {
        sortCategoryEnum: TaskSortCategory,
        sortByKey: "id",
        sortDirKey: "direction",
      }).map(({ direction, id }) => ({
        id,
        desc: direction === SortDirection.Desc,
      }))
    : [{ id: TaskSortCategory.Status, desc: false }];

  return initialSorting;
};

const defaultSortQueryParam =
  toSortString({
    columnKey: TaskSortCategory.Status,
    order: "ascend",
  }) ?? "";
