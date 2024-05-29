import { useMemo, useRef } from "react";
import styled from "@emotion/styled";
import Badge, { Variant } from "@leafygreen-ui/badge";
import { useLeafyGreenTable, LGColumnDef } from "@leafygreen-ui/table";
import { fontFamilies } from "@leafygreen-ui/tokens";
import { BaseTable } from "components/Table/BaseTable";
import { getEventDiffLines } from "./eventLogDiffs";
import { Event, EventDiffLine, EventValue } from "./types";

type TableProps = {
  after: Event["after"];
  before: Event["before"];
};

export const EventDiffTable: React.FC<TableProps> = ({ after, before }) => {
  const eventLogEntries = useMemo(
    () => getEventDiffLines(before, after) ?? [],
    [after, before],
  );

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const table = useLeafyGreenTable<EventDiffLine>({
    columns,
    containerRef: tableContainerRef,
    data: eventLogEntries,
    defaultColumn: {
      enableColumnFilter: false,
    },
  });

  return (
    <BaseTable
      data-cy="event-diff-table"
      data-cy-row="event-log-table-row"
      shouldAlternateRowColor
      table={table}
    />
  );
};

const CellText = styled.span`
  font-family: ${fontFamilies.code};
  font-size: 12px;
  line-height: 16px;
  word-break: break-all;
`;

const renderEventValue = (value: EventValue): string => {
  if (value === null || value === undefined) {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    return null;
  }
  if (typeof value === "boolean") {
    return String(value);
  }

  if (typeof value === "string") {
    return `"${value}"`;
  }

  if (typeof value === "number") {
    return value;
  }

  if (Array.isArray(value)) {
    return JSON.stringify(value).replaceAll(",", ",\n");
  }

  return JSON.stringify(value);
};

const columns: LGColumnDef<EventDiffLine>[] = [
  {
    header: "Property",
    accessorKey: "key",
    cell: ({ getValue }) => <CellText>{getValue() as string}</CellText>,
    enableSorting: true,
  },
  {
    header: "Before",
    accessorKey: "before",
    cell: ({ getValue }) => (
      <CellText>{renderEventValue(getValue() as EventValue)}</CellText>
    ),
  },
  {
    header: "After",
    accessorKey: "after",
    cell: ({ getValue }) =>
      getValue() === null || getValue() === undefined ? (
        <Badge variant={Variant.Red}>Deleted</Badge>
      ) : (
        <CellText>{renderEventValue(getValue() as EventValue)}</CellText>
      ),
  },
];
