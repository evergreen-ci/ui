import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { useLocation } from "react-router-dom";
import {
  ColumnFiltersState,
  LeafyGreenTable,
  SortingState,
  useLeafyGreenTable,
  BaseTable,
  TableWrapper,
  onChangeHandler,
  TableControl,
} from "@evg-ui/lib/components/Table";
import { ALL_VALUE } from "@evg-ui/lib/components/TreeSelect";
import { PaginationQueryParams } from "@evg-ui/lib/constants/pagination";
import { useQueryParams } from "@evg-ui/lib/hooks";
import { useTaskAnalytics } from "analytics";
import { DEFAULT_POLL_INTERVAL } from "constants/index";
import { TableQueryParams } from "constants/queryParams";
import {
  TaskTestsQuery,
  TaskTestsQueryVariables,
  SortDirection,
  TestSortCategory,
  TestResult,
  TaskQuery,
  TestSortOptions,
} from "gql/generated/types";
import { TASK_TESTS } from "gql/queries";
import { useTableSort, usePolling } from "hooks";
import {
  RequiredQueryParams,
  mapFilterParamToId,
  mapIdToFilterParam,
} from "types/task";
import { queryString } from "utils";
import { getColumnsTemplate } from "./getColumnsTemplate";

const { getLimit, getPage, getString, parseSortString, queryParamAsNumber } =
  queryString;

interface TestsTableProps {
  task: NonNullable<TaskQuery["task"]>;
}

const TestsTable: React.FC<TestsTableProps> = ({ task }) => {
  const { pathname } = useLocation();
  const { sendEvent } = useTaskAnalytics();

  const [queryParams, setQueryParams] = useQueryParams();
  const queryVariables = getQueryVariables(queryParams, task.id);
  const { execution, limitNum, pageNum, sort } = queryVariables;
  const sortBy = sort?.[0]?.sortBy;

  const appliedDefaultSort = useRef(null);
  useEffect(() => {
    // Avoid race condition where this hook overwrites TaskTabs setting a default execution.
    if (execution == null) {
      return;
    }
    if (sortBy === undefined && appliedDefaultSort.current !== pathname) {
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      appliedDefaultSort.current = pathname;
      setQueryParams({
        ...queryParams,
        [TableQueryParams.Sorts]: `${TestSortCategory.Status}:${SortDirection.Asc}`,
      });
    }
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const { data, loading, refetch, startPolling, stopPolling } = useQuery<
    TaskTestsQuery,
    TaskTestsQueryVariables
  >(TASK_TESTS, {
    variables: queryVariables,
    skip: queryVariables.execution === null,
    pollInterval: DEFAULT_POLL_INTERVAL,
  });
  usePolling<TaskTestsQuery, TaskTestsQueryVariables>({
    startPolling,
    stopPolling,
    refetch,
  });

  const clearQueryParams = () => {
    table.resetColumnFilters(true);
  };

  const { initialFilters, initialSorting } = getInitialState(queryParams);

  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>(initialFilters);

  const [sorting, setSorting] = useState<SortingState>(initialSorting);

  const updateFilters = (filterState: ColumnFiltersState) => {
    const updatedParams: Record<string, unknown> = {
      ...queryParams,
      page: "0",
      ...emptyFilterQueryParams,
    };
    filterState.forEach(({ id, value }) => {
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      const key = mapIdToFilterParam[id];
      updatedParams[key] = value;
    });
    setQueryParams(updatedParams);
    sendEvent({
      name: "Filtered tests table",
      "filter.by": Object.keys(filterState),
    });
  };

  const tableSortHandler = useTableSort({
    sendAnalyticsEvents: (sorter: SortingState) =>
      sendEvent({
        name: "Sorted tests table",
        "sort.by": sorter.map(({ id }) => id as TestSortCategory),
      }),
  });

  const { task: taskData } = data ?? {};
  const { tests } = taskData ?? {};
  const {
    filteredTestCount = 0,
    testResults,
    totalTestCount = 0,
  } = tests ?? {};

  const columns = useMemo(
    () =>
      getColumnsTemplate({
        task,
      }),
    [task],
  );

  const table: LeafyGreenTable<TestResult> = useLeafyGreenTable<TestResult>({
    columns,
    data: testResults ?? [],
    defaultColumn: {
      enableColumnFilter: false,
      enableMultiSort: true,
      enableSorting: false,
      size: "auto" as unknown as number,
      // Handle bug in sorting order
      // https://github.com/TanStack/table/issues/4289
      sortDescFirst: false,
    },
    state: {
      columnFilters,
      sorting,
    },
    initialState: {
      columnVisibility: {
        actions: task.project?.testSelection?.allowed ?? false,
      },
    },
    // Override default requirement for shift-click to multisort.
    isMultiSortEvent: () => true,
    manualFiltering: true,
    manualSorting: true,
    manualPagination: true,
    maxMultiSortColCount: 2,
    onColumnFiltersChange: onChangeHandler<ColumnFiltersState>(
      setColumnFilters,
      updateFilters,
    ),
    onSortingChange: onChangeHandler<SortingState>(
      setSorting,
      tableSortHandler,
    ),
  });

  return (
    <TableWrapper
      controls={
        <TableControl
          filteredCount={filteredTestCount}
          label="tests"
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          limit={limitNum}
          onClear={clearQueryParams}
          onPageSizeChange={() => {
            sendEvent({ name: "Changed page size" });
          }}
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          page={pageNum}
          totalCount={totalTestCount}
        />
      }
      shouldShowBottomTableControl={filteredTestCount > 10}
    >
      <BaseTable
        data-cy="tests-table"
        data-loading={loading}
        loading={loading}
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        loadingRows={limitNum}
        shouldAlternateRowColor
        table={table}
      />
    </TableWrapper>
  );
};

const emptyFilterQueryParams = {
  [RequiredQueryParams.TestName]: undefined,
  [RequiredQueryParams.Statuses]: undefined,
};

const getInitialState = (queryParams: {
  [key: string]: any;
}): {
  initialFilters: ColumnFiltersState;
  initialSorting: SortingState;
} => {
  const { [TableQueryParams.Sorts]: sorts } = queryParams;

  const initialSorting: SortingState = sorts
    ? parseSortString(sorts, {
        sortByKey: "sortBy",
        sortDirKey: "direction",
        sortCategoryEnum: TestSortCategory,
      }).map(({ direction, sortBy }) => ({
        id: sortBy,
        desc: direction === SortDirection.Desc,
      }))
    : [{ id: TestSortCategory.Status, desc: false }];

  return {
    initialSorting,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    initialFilters: Object.entries(mapFilterParamToId).reduce(
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      (accum, [param, id]) => {
        if (queryParams[param]?.length) {
          return [...accum, { id, value: queryParams[param] }];
        }
        return accum;
      },
      [],
    ),
  };
};

const getQueryVariables = (
  queryParams: { [key: string]: any },
  taskId: string,
): TaskTestsQueryVariables => {
  const sorts = queryParams[TableQueryParams.Sorts];

  let sort: TestSortOptions[] = [];
  if (sorts) {
    sort = parseSortString<
      "sortBy",
      "direction",
      TestSortCategory,
      TestSortOptions
    >(sorts, {
      sortCategoryEnum: TestSortCategory,
      sortByKey: "sortBy",
      sortDirKey: "direction",
    });
  }

  const testName = getString(queryParams[RequiredQueryParams.TestName]);
  const rawStatuses = queryParams[RequiredQueryParams.Statuses];
  const statusList = (
    Array.isArray(rawStatuses) ? rawStatuses : [rawStatuses]
  ).filter((v) => v && v !== ALL_VALUE);
  const execution = queryParams[RequiredQueryParams.Execution];
  return {
    id: taskId,
    execution: queryParamAsNumber(execution),
    sort,
    limitNum: getLimit(queryParams[PaginationQueryParams.Limit]),
    statusList,
    testName,
    pageNum: getPage(queryParams[PaginationQueryParams.Page]),
  };
};

export default TestsTable;
