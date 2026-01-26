import { useMemo, useState } from "react";
import styled from "@emotion/styled";
import { Subtitle } from "@leafygreen-ui/typography";
import PageSizeSelector from "@evg-ui/lib/components/PageSizeSelector";
import Pagination from "@evg-ui/lib/components/Pagination";
import {
  useLeafyGreenTable,
  LGColumnDef,
  ColumnFiltersState,
  LeafyGreenTable,
  BaseTable,
  onChangeHandler,
} from "@evg-ui/lib/components/Table";
import { ALL_VALUE } from "@evg-ui/lib/components/TreeSelect";
import { size } from "@evg-ui/lib/constants/tokens";
import { useQueryParams } from "@evg-ui/lib/hooks";
import usePagination from "@evg-ui/lib/src/hooks/usePagination";
import { Unpacked } from "@evg-ui/lib/types/utils";
import { useHostsTableAnalytics } from "analytics";
import { HostEventsQuery, HostEventType } from "gql/generated/types";
import { useDateFormat } from "hooks";
import { HostCard } from "pages/host/HostCard";
import HostEventString, {
  formatHostFilterOption,
} from "pages/host/HostEventString";
import { HostQueryParams } from "../constants";

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
  const hostsTableAnalytics = useHostsTableAnalytics(true);
  const { setLimit } = usePagination();
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

  const handlePageSizeChange = (pageSize: number): void => {
    setLimit(pageSize);
    hostsTableAnalytics.sendEvent({
      name: "Changed page size",
      "page.size": pageSize,
    });
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
    <HostCard error={error} loading={loading} metaData={false}>
      <TableTitle>
        <Subtitle>Recent Events</Subtitle>
        <PaginationWrapper>
          <Pagination
            currentPage={page}
            data-cy="host-event-table-pagination"
            pageSize={limit}
            totalResults={eventCount}
          />
          <PageSizeSelector
            data-cy="host-event-table-page-size-selector"
            onChange={handlePageSizeChange}
            value={limit}
          />
        </PaginationWrapper>
      </TableTitle>
      <BaseTable
        data-cy-row="host-events-table-row"
        data-cy-table="host-events-table"
        data-loading={loading}
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
        "data-cy": "event-type-filter",
        options: eventTypeFilterOptions,
      },
    },
  },
];

const TableTitle = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  margin: ${size.s} 0;
`;

const PaginationWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export default HostTable;
