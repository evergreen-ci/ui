import { useMemo, useRef } from "react";
import styled from "@emotion/styled";
import Badge, { Variant } from "@leafygreen-ui/badge";
import { useLeafyGreenTable, LGColumnDef } from "@leafygreen-ui/table";
import { fontFamilies } from "@leafygreen-ui/tokens";
import { BaseTable } from "components/Table/BaseTable";
import { JSONObject, JSONValue } from "utils/object/types";
import { EventDiffLine } from "../types";
import {
  applyCustomKeyValueRender,
  CustomKeyValueRenderConfig,
} from "./KeyRendererUtils";
import { getEventDiffLines } from "./utils";

type TableProps = {
  after?: JSONObject | null;
  before?: JSONObject | null;
  customKeyValueRenderConfig?: CustomKeyValueRenderConfig;
};

const EventDiffTable: React.FC<TableProps> = ({
  after,
  before,
  customKeyValueRenderConfig,
}) => {
  const eventLogEntries = useMemo(
    () => getEventDiffLines(before, after) ?? [],
    [after, before],
  );

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const table = useLeafyGreenTable<EventDiffLine>({
    columns: columns(customKeyValueRenderConfig),
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

const renderEventValue = (value: JSONValue): string => {
  if (value === null || value === undefined) {
    return "";
  }
  if (typeof value === "boolean") {
    return String(value);
  }

  if (typeof value === "string") {
    return `"${value}"`;
  }

  if (typeof value === "number") {
    return value.toString();
  }

  if (Array.isArray(value)) {
    return JSON.stringify(value).replaceAll(",", ",\n");
  }

  return JSON.stringify(value);
};

const columns = (
  customKeyValueRenderConfig: CustomKeyValueRenderConfig = {},
): LGColumnDef<EventDiffLine>[] => [
  {
    header: "Property",
    accessorKey: "key",
    cell: ({ getValue }) => <CellText>{getValue() as string}</CellText>,
    enableSorting: true,
  },
  {
    header: "Before",
    accessorKey: "before",
    cell: ({ getValue, row }) => (
      <CellText>
        {applyCustomKeyValueRender(
          row.original.key,
          renderEventValue(getValue() as JSONValue),
          customKeyValueRenderConfig,
        )}
      </CellText>
    ),
  },
  {
    header: "After",
    accessorKey: "after",
    cell: ({ getValue, row }) =>
      getValue() === null || getValue() === undefined ? (
        <Badge variant={Variant.Red}>Deleted</Badge>
      ) : (
        <CellText>
          {" "}
          {applyCustomKeyValueRender(
            row.original.key,
            renderEventValue(getValue() as JSONValue),
            customKeyValueRenderConfig,
          )}
        </CellText>
      ),
  },
];

export default EventDiffTable;
