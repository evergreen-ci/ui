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
import { useQueryParams } from "hooks/useQueryParam";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { parseSortString } from "utils/queryString";

const { getDefaultOptions: getDefaultSorting } = RowSorting;

interface Props {
  execution: number;
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  executionTasksFull: TaskQuery["task"]["executionTasksFull"];
  isPatch: boolean;
}

export const ExecutionTasksTable: React.FC<Props> = ({
  execution,
  executionTasksFull,
  isPatch,
}) => {
  const { sendEvent } = useTaskAnalytics();
  const updateQueryParams = useUpdateURLQueryParams();

  const [queryParams] = useQueryParams();
  const sortBy = queryParams[TableQueryParams.SortBy] as string;
  const sortDir = queryParams[TableQueryParams.SortDir] as string;
  const sorts = queryParams[TableQueryParams.Sorts] as string;

  // Apply default sort if no sorting method is defined.
  useEffect(() => {
    if (!sorts && !sortBy && !sortDir) {
      updateQueryParams({
        sortBy: TaskSortCategory.Status,
        sortDir: SortDirection.Asc,
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const uniqueExecutions = new Set([
    execution,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    ...executionTasksFull.map((t) => t.execution),
  ]);

  const initialSorting = useMemo(
    () => getInitialSorting(queryParams),
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
    // @ts-expect-error: FIXME. This comment was added by an automated script.
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

const getInitialSorting = (queryParams: {
  [key: string]: any;
}): SortingState => {
  const {
    [TableQueryParams.SortBy]: sortBy,
    [TableQueryParams.SortDir]: sortDir,
    [TableQueryParams.Sorts]: sorts,
  } = queryParams;

  let initialSorting = [{ id: TaskSortCategory.Status, desc: false }];
  if (sortBy && sortDir) {
    initialSorting = [
      {
        id: sortBy as TaskSortCategory,
        desc: sortDir === SortDirection.Desc,
      },
    ];
  } else if (sorts) {
    const parsedSorts = parseSortString<
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
    });
    initialSorting = parsedSorts.map(({ direction, id }) => ({
      id,
      desc: direction === SortDirection.Desc,
    }));
  }

  return initialSorting;
};
