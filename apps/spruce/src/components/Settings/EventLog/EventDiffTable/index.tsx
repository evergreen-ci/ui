import { useMemo } from "react";
import { Badge, Variant } from "@leafygreen-ui/badge";
import {
  BaseTable,
  LGColumnDef,
  useLeafyGreenTable,
} from "@evg-ui/lib/components/Table";
import { JSONObject, JSONValue } from "utils/object/types";
import { EventDiffLine } from "../types";
import styles from "./index.module.css";
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
    <span className={styles.arrayValue}>
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
              <del
                aria-label={`Removed ${formattedValue}`}
                className={styles.removedArrayItem}
              >
                {displayValue}
              </del>
            ) : (
              <ins
                aria-label={`Added ${formattedValue}`}
                className={styles.addedArrayItem}
              >
                {displayValue}
              </ins>
            );
        }

        return (
          <span key={key} className={styles.arrayItem}>
            {renderedValue}
          </span>
        );
      })}
      ]
    </span>
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

  if (!Array.isArray(value)) {
    return customRenderedValue;
  }

  return renderArrayValue(
    Array.isArray(before) ? before : [],
    Array.isArray(after) ? after : [],
    side,
  );
};

const columns = (
  customKeyValueRenderConfig: CustomKeyValueRenderConfig = {},
): LGColumnDef<EventDiffLine>[] => [
  {
    header: "Property",
    accessorKey: "key",
    cell: ({ getValue }) => (
      <span className={styles.cellText}>{getValue() as string}</span>
    ),
    enableSorting: true,
  },
  {
    header: "Before",
    accessorKey: "before",
    cell: ({ getValue, row }) => (
      <span className={styles.cellText}>
        {renderCellValue(
          row.original.key,
          getValue() as JSONValue,
          row.original.after,
          "before",
          customKeyValueRenderConfig,
        )}
      </span>
    ),
  },
  {
    header: "After",
    accessorKey: "after",
    cell: ({ getValue, row }) =>
      getValue() === null || getValue() === undefined ? (
        <Badge variant={Variant.Red}>Deleted</Badge>
      ) : (
        <span className={styles.cellText}>
          {renderCellValue(
            row.original.key,
            row.original.before,
            getValue() as JSONValue,
            "after",
            customKeyValueRenderConfig,
          )}
        </span>
      ),
  },
];

export default EventDiffTable;
