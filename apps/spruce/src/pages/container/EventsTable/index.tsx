import { useMemo, useRef } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { useLeafyGreenTable, LGColumnDef } from "@leafygreen-ui/table";
import { Subtitle, SubtitleProps } from "@leafygreen-ui/typography";
import { useParams } from "react-router-dom";
import PageSizeSelector from "components/PageSizeSelector";
import Pagination from "components/Pagination";
import { SiderCard, TableControlInnerRow } from "components/styles";
import { BaseTable } from "components/Table/BaseTable";
import { slugs } from "constants/routes";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import { PodEventsQuery, PodEventsQueryVariables } from "gql/generated/types";
import { POD_EVENTS } from "gql/queries";
import { useDateFormat } from "hooks";
import usePagination from "hooks/usePagination";
import { Unpacked } from "types/utils";
import { EventCopy } from "./EventCopy";

type ContainerEvent = Unpacked<
  PodEventsQuery["pod"]["events"]["eventLogEntries"]
>;

const EventsTable: React.FC<{}> = () => {
  const getDateCopy = useDateFormat();

  const { limit, page, setLimit } = usePagination();
  const { [slugs.podId]: podId } = useParams();
  const dispatchToast = useToastContext();

  const { data: podEventsData, loading } = useQuery<
    PodEventsQuery,
    PodEventsQueryVariables
  >(POD_EVENTS, {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    variables: { id: podId, page, limit },
    onError: (err) => {
      dispatchToast.error(
        `There was an error loading the pod events: ${err.message}`,
      );
    },
  });

  const { count, eventLogEntries } = useMemo(
    () => podEventsData?.pod.events ?? { eventLogEntries: [], count: 0 },
    [podEventsData?.pod?.events],
  );

  const columns: LGColumnDef<ContainerEvent>[] = useMemo(
    () => [
      {
        header: "Date",
        accessorKey: "timestamp",
        cell: ({ getValue, row }) => (
          <span data-cy={`${row.original.eventType}-time`}>
            {getDateCopy(getValue() as Date)}
          </span>
        ),
      },
      {
        header: "Event",
        cell: ({ row }) => (
          <EventCopy
            data-cy={`event-type-${row.original.eventType}`}
            event={row.original}
          />
        ),
      },
    ],
    [getDateCopy],
  );

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const table = useLeafyGreenTable<ContainerEvent>({
    columns,
    containerRef: tableContainerRef,
    data: eventLogEntries ?? [],
    defaultColumn: {
      enableColumnFilter: false,
    },
    manualPagination: true,
  });

  return (
    <SiderCard>
      <TableTitle>
        <StyledSubtitle>Recent Events</StyledSubtitle>
        <TableControlInnerRow>
          <Pagination
            currentPage={page}
            totalResults={count ?? 0}
            pageSize={limit}
          />
          <PageSizeSelector
            data-cy="pod-events-page-size-selector"
            value={limit}
            onChange={setLimit}
          />
        </TableControlInnerRow>
      </TableTitle>
      <BaseTable
        data-cy-table="container-events-table"
        data-loading={loading}
        loading={loading}
        loadingRows={limit}
        shouldAlternateRowColor
        table={table}
      />
    </SiderCard>
  );
};

const StyledSubtitle = styled(Subtitle)<SubtitleProps>`
  margin: ${size.s} 0;
`;

const TableTitle = styled.div`
  flex-wrap: nowrap;
  display: flex;
  justify-content: space-between;
`;

export default EventsTable;
