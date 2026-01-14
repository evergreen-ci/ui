import { useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import styled from "@emotion/styled";
import { Subtitle, SubtitleProps } from "@leafygreen-ui/typography";
import { useParams } from "react-router-dom";
import PageSizeSelector from "@evg-ui/lib/components/PageSizeSelector";
import Pagination from "@evg-ui/lib/components/Pagination";
import {
  useLeafyGreenTable,
  LGColumnDef,
  BaseTable,
} from "@evg-ui/lib/components/Table";
import { TableControlInnerRow } from "@evg-ui/lib/components/Table/TableControl/styles";
import { size } from "@evg-ui/lib/constants/tokens";
import { useErrorToast } from "@evg-ui/lib/hooks";
import usePagination from "@evg-ui/lib/src/hooks/usePagination";
import { Unpacked } from "@evg-ui/lib/types/utils";
import { SiderCard } from "components/styles";
import { slugs } from "constants/routes";
import { PodEventsQuery, PodEventsQueryVariables } from "gql/generated/types";
import { POD_EVENTS } from "gql/queries";
import { useDateFormat } from "hooks";
import { EventCopy } from "./EventCopy";

type ContainerEvent = Unpacked<
  PodEventsQuery["pod"]["events"]["eventLogEntries"]
>;

const EventsTable: React.FC = () => {
  const getDateCopy = useDateFormat();

  const { limit, page, setLimit } = usePagination();
  const { [slugs.podId]: podId } = useParams();

  const {
    data: podEventsData,
    dataState,
    error,
    loading,
  } = useQuery<PodEventsQuery, PodEventsQueryVariables>(POD_EVENTS, {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    variables: { id: podId, page, limit },
  });
  useErrorToast(error, "There was an error loading the pod events");

  const { count, eventLogEntries } = useMemo(() => {
    if (dataState !== "complete") {
      return { eventLogEntries: [], count: 0 };
    }
    return podEventsData?.pod?.events;
  }, [dataState, podEventsData?.pod?.events]);

  const columns: LGColumnDef<ContainerEvent>[] = useMemo(
    () => getColumns(getDateCopy),
    [getDateCopy],
  );

  const table = useLeafyGreenTable<ContainerEvent>({
    columns,
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
            pageSize={limit}
            totalResults={count ?? 0}
          />
          <PageSizeSelector
            data-cy="pod-events-page-size-selector"
            onChange={setLimit}
            value={limit}
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

const getColumns = (
  getDateCopy: (date: Date) => string,
): LGColumnDef<ContainerEvent>[] => [
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
];

const StyledSubtitle = styled(Subtitle)<SubtitleProps>`
  margin: ${size.s} 0;
`;

const TableTitle = styled.div`
  flex-wrap: nowrap;
  display: flex;
  justify-content: space-between;
`;

export default EventsTable;
