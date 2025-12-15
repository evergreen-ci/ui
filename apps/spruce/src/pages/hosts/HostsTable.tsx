import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { WordBreak, StyledRouterLink } from "@evg-ui/lib/components/styles";
import {
  ColumnFiltersState,
  ColumnFiltering,
  RowSelectionState,
  RowSorting,
  SortingState,
  useLeafyGreenTable,
  BaseTable,
  onChangeHandler,
  LGColumnDef,
} from "@evg-ui/lib/components/Table";
import { useQueryParams } from "@evg-ui/lib/hooks";
import { Unpacked } from "@evg-ui/lib/types/utils";
import { useHostsTableAnalytics } from "analytics";
import { hostStatuses } from "constants/hosts";
import { getHostRoute, getTaskRoute } from "constants/routes";
import { HostSortBy, HostsQuery } from "gql/generated/types";
import { useTableSort } from "hooks/useTableSort";
import { HostsTableFilterParams, mapIdToFilterParam } from "types/host";

type Host = Unpacked<HostsQuery["hosts"]["hosts"]>;

const { getDefaultOptions: getDefaultFiltering } = ColumnFiltering;
const { getDefaultOptions: getDefaultSorting } = RowSorting;

interface Props {
  hosts: HostsQuery["hosts"]["hosts"];
  initialFilters: ColumnFiltersState;
  initialSorting: SortingState;
  limit: number;
  loading: boolean;
  setSelectedHosts: React.Dispatch<React.SetStateAction<Host[]>>;
}

export const HostsTable: React.FC<Props> = ({
  hosts,
  initialFilters,
  initialSorting,
  limit,
  loading,
  setSelectedHosts,
}) => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const { sendEvent } = useHostsTableAnalytics();

  const [queryParams, setQueryParams] = useQueryParams();

  const updateRowSelection = (rowState: RowSelectionState) => {
    setRowSelection(rowState);
    const selectedHosts = Object.keys(rowState).map(
      (index) => hosts[parseInt(index, 10)],
    );
    setSelectedHosts(selectedHosts);
  };

  const setSorting = (s: SortingState) =>
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    getDefaultSorting(table).onSortingChange(s);

  const tableSortHandler = useTableSort({
    sendAnalyticsEvents: () => sendEvent({ name: "Sorted hosts table" }),
  });

  const setFilters = (f: ColumnFiltersState) =>
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    getDefaultFiltering(table).onColumnFiltersChange(f);

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
      name: "Filtered hosts table",
      "filter.by": Object.keys(filterState),
    });
  };

  const table = useLeafyGreenTable<Host>({
    columns,
    data: hosts ?? [],
    defaultColumn: {
      enableColumnFilter: false,
      enableSorting: false,
      // Handle bug in sorting order
      // https://github.com/TanStack/table/issues/4289
      sortDescFirst: false,
    },
    initialState: {
      columnFilters: initialFilters,
      sorting: initialSorting,
    },
    state: {
      rowSelection,
    },
    enableMultiSort: false,
    hasSelectableRows: true,
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    onColumnFiltersChange: onChangeHandler<ColumnFiltersState>(
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      setFilters,
      (updatedState) => {
        updateFilters(updatedState);
        table.resetRowSelection();
      },
    ),
    onRowSelectionChange: onChangeHandler<RowSelectionState>(
      setRowSelection,
      updateRowSelection,
    ),
    onSortingChange: onChangeHandler<SortingState>(
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      setSorting,
      (updatedState) => {
        tableSortHandler(updatedState);
        table.resetRowSelection();
      },
    ),
  });

  return (
    <BaseTable
      data-cy="hosts-table"
      data-loading={loading}
      loading={loading}
      loadingRows={limit}
      shouldAlternateRowColor
      table={table}
    />
  );
};

const emptyFilterQueryParams = Object.values(HostsTableFilterParams).reduce(
  (a, v) => ({ ...a, [v]: undefined }),
  {},
);

const columns: LGColumnDef<Host>[] = [
  {
    header: "ID",
    accessorKey: "id",
    id: HostSortBy.Id,
    cell: ({ getValue }): React.JSX.Element => {
      const id = getValue() as string;
      return (
        <StyledRouterLink data-cy="host-id-link" to={getHostRoute(id)}>
          <WordBreak>{id}</WordBreak>
        </StyledRouterLink>
      );
    },
    enableColumnFilter: true,
    enableSorting: true,
    meta: {
      search: {
        "data-cy": "host-id-filter",
        placeholder: "Search ID or DNS name",
      },
      width: "17%",
    },
  },
  {
    header: "Distro",
    accessorKey: "distroId",
    id: HostSortBy.Distro,
    enableColumnFilter: true,
    enableSorting: true,
    meta: {
      search: {
        "data-cy": "distro-id-filter",
        placeholder: "Search distro regex",
      },
      width: "15%",
    },
  },
  {
    header: "Status",
    accessorKey: "status",
    id: HostSortBy.Status,
    enableColumnFilter: true,
    enableSorting: true,
    meta: {
      treeSelect: {
        "data-cy": "statuses-filter",
        options: hostStatuses,
      },
      width: "10%",
    },
  },
  {
    header: "Current Task",
    accessorKey: "runningTask",
    id: HostSortBy.CurrentTask,
    cell: ({ getValue }) => {
      const task = getValue() as Host["runningTask"];
      return task?.id ? (
        <StyledRouterLink
          data-cy="current-task-link"
          to={getTaskRoute(task.id)}
        >
          <WordBreak all>{task?.name}</WordBreak>
        </StyledRouterLink>
      ) : (
        ""
      );
    },
    enableColumnFilter: true,
    enableSorting: true,
    meta: {
      search: {
        "data-cy": "current-task-id-filter",
        placeholder: "Search by task ID",
      },
      width: "18%",
    },
  },
  {
    header: "Elapsed",
    accessorKey: "elapsed",
    id: HostSortBy.Elapsed,
    cell: ({ getValue }) => {
      const elapsed = getValue() as Date;
      return elapsed ? formatDistanceToNow(new Date(elapsed)) : "N/A";
    },
    enableSorting: true,
    meta: {
      width: "10%",
    },
  },
  {
    header: "Uptime",
    accessorKey: "uptime",
    id: HostSortBy.Uptime,
    cell: ({ getValue }) => {
      const uptime = getValue() as Date;
      return uptime ? formatDistanceToNow(new Date(uptime)) : "N/A";
    },
    enableSorting: true,
    meta: {
      width: "10%",
    },
  },
  {
    header: "Idle Time",
    accessorKey: "totalIdleTime",
    id: HostSortBy.IdleTime,
    cell: ({ getValue }) => {
      const totalIdleTime = getValue() as number;
      return totalIdleTime
        ? formatDistanceToNow(new Date(Date.now() - totalIdleTime))
        : "N/A";
    },
    enableSorting: true,
    meta: {
      width: "10%",
    },
  },
  {
    header: "Owner",
    accessorKey: "startedBy",
    id: HostSortBy.Owner,
    cell: ({ getValue }) => <WordBreak>{getValue() as string}</WordBreak>,
    enableColumnFilter: true,
    enableSorting: true,
    meta: {
      search: {
        "data-cy": "owner-filter",
      },
      width: "10%",
    },
  },
];
