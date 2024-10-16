import { useEffect, useMemo, useRef } from "react";
import { useQuery } from "@apollo/client";
import {
  ColumnFiltering,
  ColumnFiltersState,
  LeafyGreenTable,
  RowSorting,
  SortingState,
  useLeafyGreenTable,
} from "@leafygreen-ui/table";
import { useLocation } from "react-router-dom";
import { useTaskAnalytics } from "analytics";
import { BaseTable } from "components/Table/BaseTable";
import TableControl from "components/Table/TableControl";
import TableWrapper from "components/Table/TableWrapper";
import { onChangeHandler } from "components/Table/utils";
import { ALL_VALUE } from "components/TreeSelect";
import { DEFAULT_POLL_INTERVAL } from "constants/index";
import { PaginationQueryParams, TableQueryParams } from "constants/queryParams";
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
import { useQueryParams } from "hooks/useQueryParam";
import {
  RequiredQueryParams,
  mapFilterParamToId,
  mapIdToFilterParam,
} from "types/task";
import { queryString } from "utils";
import { getColumnsTemplate } from "./testsTable/getColumnsTemplate";

const { getLimit, getPage, getString, parseSortString, queryParamAsNumber } =
  queryString;
const { getDefaultOptions: getDefaultFiltering } = ColumnFiltering;
const { getDefaultOptions: getDefaultSorting } = RowSorting;

interface TestsTableProps {
  task: TaskQuery["task"];
}

export const TestsTable: React.FC<TestsTableProps> = ({ task }) => {
  const { pathname } = useLocation();
  const { sendEvent } = useTaskAnalytics();

  const [queryParams, setQueryParams] = useQueryParams();
  // @ts-expect-error: FIXME. This comment was added by an automated script.
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
        [TableQueryParams.SortBy]: TestSortCategory.Status,
        [TableQueryParams.SortDir]: SortDirection.Asc,
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
  usePolling({ startPolling, stopPolling, refetch });

  const clearQueryParams = () => {
    table.resetColumnFilters(true);
  };

  const updateFilters = (filterState: ColumnFiltersState) => {
    const updatedParams = {
      ...queryParams,
      page: "0",
      ...emptyFilterQueryParams,
    };

    filterState.forEach(({ id, value }) => {
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      const key = mapIdToFilterParam[id];
      // @ts-expect-error: FIXME. This comment was added by an automated script.
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
  const { filteredTestCount, testResults, totalTestCount } = tests ?? {};

  const { initialFilters, initialSorting } = useMemo(
    () => getInitialState(queryParams),
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const setSorting = (s: SortingState) =>
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    getDefaultSorting(table).onSortingChange(s);

  const setFilters = (f: ColumnFiltersState) =>
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    getDefaultFiltering(table).onColumnFiltersChange(f);

  const columns = useMemo(() => getColumnsTemplate({ task }), [task]);

  const tableContainerRef = useRef<HTMLDivElement>(null);

  const table: LeafyGreenTable<TestResult> = useLeafyGreenTable<TestResult>({
    columns,
    containerRef: tableContainerRef,
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
    initialState: {
      columnFilters: initialFilters,
      sorting: initialSorting,
    },
    // Override default requirement for shift-click to multisort.
    isMultiSortEvent: () => true,
    manualFiltering: true,
    manualSorting: true,
    manualPagination: true,
    maxMultiSortColCount: 2,
    onColumnFiltersChange: onChangeHandler<ColumnFiltersState>(
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      setFilters,
      updateFilters,
    ),
    onSortingChange: onChangeHandler<SortingState>(
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      setSorting,
      tableSortHandler,
    ),
  });

  return (
    <TableWrapper
      controls={
        <TableControl
          // @ts-expect-error: FIXME. This comment was added by an automated script.
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
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          totalCount={totalTestCount}
        />
      }
      // @ts-expect-error: FIXME. This comment was added by an automated script.
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
  const {
    [TableQueryParams.SortBy]: sortBy,
    [TableQueryParams.SortDir]: sortDir,
  } = queryParams;

  return {
    initialSorting:
      sortBy && sortDir
        ? [{ id: sortBy, desc: sortDir === SortDirection.Desc }]
        : [{ id: TestSortCategory.Status, desc: false }],
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
  // Detemining sort category
  const parsedSortBy = getString(queryParams[TableQueryParams.SortBy]);
  const testSortCategories: string[] = Object.values(TestSortCategory);
  const sortBy = testSortCategories.includes(parsedSortBy)
    ? (parsedSortBy as TestSortCategory)
    : undefined;
  const sorts = queryParams[TableQueryParams.Sorts];

  // Determining sort direction
  const parsedDirection = getString(queryParams[TableQueryParams.SortDir]);
  const direction =
    parsedDirection === SortDirection.Desc
      ? SortDirection.Desc
      : SortDirection.Asc;

  let sort: TestSortOptions[] = [];
  if (sortBy && direction) {
    sort = [{ sortBy, direction }];
  } else if (sorts) {
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
