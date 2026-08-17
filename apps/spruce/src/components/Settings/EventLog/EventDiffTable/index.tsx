import { useMemo } from "react";
import styled from "@emotion/styled";
import { Badge, Variant } from "@leafygreen-ui/badge";
import { palette } from "@leafygreen-ui/palette";
import { fontFamilies } from "@leafygreen-ui/tokens";
import {
  BaseTable,
  LGColumnDef,
  useLeafyGreenTable,
} from "@evg-ui/lib/components/Table";
import { JSONObject, JSONValue } from "utils/object/types";
import { EventDiffLine } from "../types";
import { getArrayDiffIndices, getEventDiffLines } from "./utils";
import {
  CustomKeyValueRenderConfig,
  applyCustomKeyValueRender,
} from "./utils/keyRenderer";

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

  const table = useLeafyGreenTable<EventDiffLine>({
    columns: columns(customKeyValueRenderConfig),
    data: eventLogEntries,
    defaultColumn: {
      enableColumnFilter: false,
    },
  });

  return (
    <BaseTable
      data-testid="event-diff-table"
      data-testid-row="event-log-table-row"
      shouldAlternateRowColor
      table={table}
    />
  );
};

const CellText = styled.span`
  font-family: ${fontFamilies.code};
  font-size: 12px;
  line-height: 16px;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
`;

const ArrayValue = styled.span`
  display: block;
  white-space: pre-wrap;
`;

const ArrayItem = styled.span`
  display: block;
  padding-left: 12px;
`;

const AddedArrayItem = styled.ins`
  background-color: ${palette.green.light3};
  border-radius: 2px;
`;

const RemovedArrayItem = styled.del`
  background-color: ${palette.red.light3};
  border-radius: 2px;
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

  return JSON.stringify(value, null, 2);
};

const renderArrayValue = (
  before: JSONValue[],
  after: JSONValue[],
  side: "after" | "before",
) => {
  const changedIndices = getArrayDiffIndices(before, after);
  const value = side === "before" ? before : after;
  const changedIndexSet = new Set(changedIndices[side]);
  const itemOccurrences = new Map<string, number>();

  return (
    <ArrayValue>
      [
      {value.map((item, index) => {
        const formattedValue = renderEventValue(item);
        const displayValue = `${formattedValue}${
          index < value.length - 1 ? "," : ""
        }`;
        const occurrence = itemOccurrences.get(formattedValue) ?? 0;
        itemOccurrences.set(formattedValue, occurrence + 1);
        const key = `${formattedValue}-${occurrence}`;
        let renderedValue: React.ReactNode = displayValue;

        if (changedIndexSet.has(index)) {
          renderedValue =
            side === "before" ? (
              <RemovedArrayItem aria-label={`Removed ${formattedValue}`}>
                {displayValue}
              </RemovedArrayItem>
            ) : (
              <AddedArrayItem aria-label={`Added ${formattedValue}`}>
                {displayValue}
              </AddedArrayItem>
            );
        }

        return <ArrayItem key={key}>{renderedValue}</ArrayItem>;
      })}
      ]
    </ArrayValue>
  );
};

const renderCellValue = (
  key: string,
  before: JSONValue,
  after: JSONValue,
  side: "after" | "before",
  customKeyValueRenderConfig: CustomKeyValueRenderConfig,
) => {
  const value = side === "before" ? before : after;
  const customRenderedValue = applyCustomKeyValueRender(
    key,
    renderEventValue(value),
    customKeyValueRenderConfig,
  );

  if (typeof customRenderedValue !== "string") {
    return customRenderedValue;
  }

  if (Array.isArray(before) || Array.isArray(after)) {
    return renderArrayValue(
      Array.isArray(before) ? before : [],
      Array.isArray(after) ? after : [],
      side,
    );
  }

  return customRenderedValue;
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
        {renderCellValue(
          row.original.key,
          getValue() as JSONValue,
          row.original.after,
          "before",
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
          {renderCellValue(
            row.original.key,
            row.original.before,
            getValue() as JSONValue,
            "after",
            customKeyValueRenderConfig,
          )}
        </CellText>
      ),
  },
];

export default EventDiffTable;
