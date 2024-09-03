import { useMemo, useRef } from "react";
import { ApolloError } from "@apollo/client";
import styled from "@emotion/styled";
import { useLeafyGreenTable, LGColumnDef } from "@leafygreen-ui/table";
import { Subtitle, SubtitleProps } from "@leafygreen-ui/typography";
import { Unpacked } from "@evg-ui/lib/types/utils";
import { useHostsTableAnalytics } from "analytics";
import PageSizeSelector from "components/PageSizeSelector";
import Pagination from "components/Pagination";
import { BaseTable } from "components/Table/BaseTable";
import { size } from "constants/tokens";
import { HostEventsQuery } from "gql/generated/types";
import { useDateFormat } from "hooks";
import usePagination from "hooks/usePagination";
import { HostCard } from "pages/host/HostCard";
import { HostEventString } from "pages/host/HostEventString";

type HostEvent = Unpacked<HostEventsQuery["hostEvents"]["eventLogEntries"]>;

export const HostTable: React.FC<{
  loading: boolean;
  eventData: HostEventsQuery;
  error: ApolloError;
  page: number;
  limit: number;
  eventsCount: number;
}> = ({ error, eventData, eventsCount, limit, loading, page }) => {
  const isHostPage = true;
  const hostsTableAnalytics = useHostsTableAnalytics(isHostPage);
  const { setLimit } = usePagination();
  const getDateCopy = useDateFormat();
  const logEntries = useMemo(
    () => eventData?.hostEvents?.eventLogEntries ?? [],
    [eventData?.hostEvents?.eventLogEntries],
  );

  const handlePageSizeChange = (pageSize: number): void => {
    setLimit(pageSize);
    hostsTableAnalytics.sendEvent({
      name: "Changed page size",
      "page.size": pageSize,
    });
  };

  const columns: LGColumnDef<HostEvent>[] = useMemo(
    () => [
      {
        header: "Date",
        accessorKey: "timestamp",
        cell: ({ getValue }) => getDateCopy(getValue() as Date),
      },
      {
        header: "Event",
        accessorKey: "eventType",
        cell: ({ getValue, row }) => (
          <HostEventString
            data={row.original.data}
            eventType={getValue() as string}
          />
        ),
      },
    ],
    [getDateCopy],
  );

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const table = useLeafyGreenTable<HostEvent>({
    columns,
    containerRef: tableContainerRef,
    data: logEntries ?? [],
    defaultColumn: {
      enableColumnFilter: false,
    },
    manualPagination: true,
  });

  return (
    <HostCard error={error} loading={loading} metaData={false}>
      <TableTitle>
        <StyledSubtitle>Recent Events</StyledSubtitle>
        <PaginationWrapper>
          <Pagination
            currentPage={page}
            data-cy="host-event-table-pagination"
            pageSize={limit}
            totalResults={eventsCount}
          />
          <PageSizeSelector
            data-cy="host-event-table-page-size-selector"
            onChange={handlePageSizeChange}
            value={limit}
          />
        </PaginationWrapper>
      </TableTitle>
      <BaseTable
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

const StyledSubtitle = styled(Subtitle)<SubtitleProps>`
  margin-bottom: 20px;
  margin-top: ${size.s};
`;

const TableTitle = styled.div`
  flex-wrap: nowrap;
  display: flex;
  justify-content: space-between;
`;

const PaginationWrapper = styled.div`
  display: flex;
  align-items: center;
`;
