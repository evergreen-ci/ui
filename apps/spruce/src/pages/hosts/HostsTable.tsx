import { useState } from "react";
import { Link } from "@via-ds/components/typography";
import { formatDistanceToNow } from "date-fns";
import { WordBreak } from "@evg-ui/lib/components/styles";
import {
  ColumnFiltersState,
  RowSelectionState,
  SortingState,
  ViaBaseTable,
  ViaColumnDef,
  onChangeHandler,
  useTable,
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
  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>(initialFilters);
  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  const { sendEvent } = useHostsTableAnalytics();

  const [queryParams, setQueryParams] = useQueryParams();

  const updateRowSelection = (rowState: RowSelectionState) => {
    setRowSelection(rowState);
    const selectedHosts = Object.keys(rowState).map(
      (index) => hosts[parseInt(index, 10)],
    );
    setSelectedHosts(selectedHosts);
  };

  const tableSortHandler = useTableSort({
    sendAnalyticsEvents: () => sendEvent({ name: "Sorted hosts table" }),
  });

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

  const table = useTable<Host>({
    columns,
    data: hosts ?? [],
    defaultColumn: {
      enableColumnFilter: false,
      enableSorting: false,
      // Handle bug in sorting order
      // https://github.com/TanStack/table/issues/4289
      sortDescFirst: false,
    },
    state: {
      columnFilters,
      rowSelection,
      sorting,
    },
    enableMultiSort: false,
    hasSelectableRows: true,
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    onColumnFiltersChange: onChangeHandler<ColumnFiltersState>(
      setColumnFilters,
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
      setSorting,
      (updatedState) => {
        tableSortHandler(updatedState);
        table.resetRowSelection();
      },
    ),
  });

  return (
    <ViaBaseTable
      data-loading={loading}
      data-testid="hosts-table"
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

const columns: ViaColumnDef<Host>[] = [
  {
    header: "ID",
    accessorKey: "id",
    id: HostSortBy.Id,
    cell: ({ getValue }): React.JSX.Element => {
      const id = getValue() as string;
      return (
        <Link
          data-testid="host-id-link"
          href={getHostRoute(id)}
          linkStyle="internal"
        >
          <WordBreak>{id}</WordBreak>
        </Link>
      );
    },
    enableColumnFilter: true,
    enableSorting: true,
    meta: {
      search: {
        "data-testid": "host-id-filter",
        placeholder: "Search ID or DNS name",
      },
      width: "17%",
    },
  },
  {
    header: "Distro",
    accessorKey: "distro.id",
    id: HostSortBy.Distro,
    enableColumnFilter: true,
    enableSorting: true,
    meta: {
      search: {
        "data-testid": "distro-id-filter",
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
        "data-testid": "statuses-filter",
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
        <Link
          data-testid="current-task-link"
          href={getTaskRoute(task.id)}
          linkStyle="internal"
        >
          <WordBreak all>{task?.name}</WordBreak>
        </Link>
      ) : (
        ""
      );
    },
    enableColumnFilter: true,
    enableSorting: true,
    meta: {
      search: {
        "data-testid": "current-task-id-filter",
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
        "data-testid": "owner-filter",
      },
      width: "10%",
    },
  },
];
