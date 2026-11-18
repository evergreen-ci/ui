import { useMemo, useState } from "react";
import { H4 } from "@via-ds/components";
import { Pagination } from "@evg-ui/lib/components/Pagination";
import {
  BaseTable,
  ColumnFiltersState,
  LGColumnDef,
  LeafyGreenTable,
  onChangeHandler,
  useLeafyGreenTable,
} from "@evg-ui/lib/components/Table";
import { ALL_VALUE } from "@evg-ui/lib/components/TreeSelect";
import { useQueryParams } from "@evg-ui/lib/hooks";
import { Unpacked } from "@evg-ui/lib/types/utils";
import { useHostsTableAnalytics } from "analytics";
import { HostEventType, HostEventsQuery } from "gql/generated/types";
import { useDateFormat } from "hooks";
import { HostCard } from "pages/host/HostCard";
import HostEventString, {
  formatHostFilterOption,
} from "pages/host/HostEventString";
import { HostQueryParams } from "../constants";
import styles from "./index.module.css";

type HostEvent = Unpacked<
  NonNullable<HostEventsQuery["host"]>["events"]["eventLogEntries"]
>;

interface HostTableProps {
  error?: Error;
  eventCount: number;
  eventLogEntries: HostEvent[];
  eventTypes: HostEventType[];
  initialFilters: ColumnFiltersState;
  limit: number;
  loading: boolean;
  page: number;
}

const HostTable: React.FC<HostTableProps> = ({
  error,
  eventCount,
  eventLogEntries,
  eventTypes,
  initialFilters,
  limit,
  loading,
  page,
}) => {
  const { sendEvent } = useHostsTableAnalytics(true);
  const getDateCopy = useDateFormat();
  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>(initialFilters);

  const [, setQueryParams] = useQueryParams();

  const updateFilters = (filterState: ColumnFiltersState) => {
    const updatedParams = {
      page: "0",
    };
    filterState.forEach(({ id, value }) => {
      // @ts-expect-error: value is an unknown type.
      updatedParams[id] = value;
    });
    setQueryParams(updatedParams);
  };

  const eventTypeFilterOptions = useMemo(
    () => [
      {
        title: "All",
        key: ALL_VALUE,
        value: ALL_VALUE,
      },
      ...eventTypes.map((e) => ({
        title: formatHostFilterOption(e),
        value: e,
        key: e,
      })),
    ],
    [eventTypes],
  );

  const hostEvents = useMemo(() => eventLogEntries ?? [], [eventLogEntries]);

  const columns: LGColumnDef<HostEvent>[] = useMemo(
    () => getColumns(getDateCopy, eventTypeFilterOptions),
    [getDateCopy, eventTypeFilterOptions],
  );

  const table: LeafyGreenTable<HostEvent> = useLeafyGreenTable<HostEvent>({
    columns,
    data: hostEvents,
    defaultColumn: {
      enableColumnFilter: false,
    },
    initialState: {
      columnFilters: initialFilters,
    },
    state: {
      columnFilters,
    },
    onColumnFiltersChange: onChangeHandler<ColumnFiltersState>(
      setColumnFilters,
      (updatedState) => updateFilters(updatedState),
    ),
    manualPagination: true,
  });

  return (
    <HostCard error={error} loading={loading}>
      <div className={styles.tableTitle}>
        <H4>Recent Events</H4>
        <div className={styles.paginationWrapper}>
          <Pagination
            currentPage={page}
            data-testid="host-event-table-pagination"
            loading={loading}
            onPageChange={(newPage) =>
              sendEvent({
                name: "Changed page",
                "page.number": newPage,
              })
            }
            onPageSizeChange={(newPageSize) =>
              sendEvent({
                name: "Changed page size",
                "page.size": newPageSize,
              })
            }
            pageSize={limit}
            totalResults={eventCount}
          />
        </div>
      </div>
      <BaseTable
        data-loading={loading}
        data-testid-row="host-events-table-row"
        data-testid-table="host-events-table"
        loading={loading}
        loadingRows={limit}
        shouldAlternateRowColor
        table={table}
      />
    </HostCard>
  );
};

const getColumns = (
  getDateCopy: (date: Date) => string,
  eventTypeFilterOptions: { title: string; value: string; key: string }[],
): LGColumnDef<HostEvent>[] => [
  {
    header: "Date",
    accessorKey: "timestamp",
    cell: ({ getValue }) => getDateCopy(getValue() as Date),
    meta: {
      width: "25%",
    },
  },
  {
    header: "Event",
    accessorKey: "eventType",
    id: HostQueryParams.EventType,
    cell: ({ getValue, row }) => (
      <HostEventString
        data={row.original.data}
        eventType={getValue() as string}
      />
    ),
    enableColumnFilter: true,
    meta: {
      treeSelect: {
        "data-testid": "event-type-filter",
        options: eventTypeFilterOptions,
      },
    },
  },
];

export default HostTable;
