import { useEffect, useMemo } from "react";
import { useQueryParam } from "@evg-ui/lib/hooks";
import { HistoryQueryParams } from "types/history";
import { array } from "utils";
import { useHistoryTable } from "../HistoryTableContext";

const { toArray } = array;
const useColumns = <T>(allColumns: T[], accessFunc: (column: T) => string) => {
  const [queryParams] = useQueryParam<string[]>(
    HistoryQueryParams.VisibleColumns,
    [],
  );
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const { addColumns } = useHistoryTable();

  const selectedColumnsInQuery = useMemo(
    () => toArray(queryParams),
    [queryParams],
  );

  const activeColumns = useMemo(
    () =>
      selectedColumnsInQuery.length
        ? allColumns?.filter((column) =>
            selectedColumnsInQuery.includes(accessFunc(column)),
          )
        : allColumns,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedColumnsInQuery, allColumns],
  );

  const visibleColumns = useMemo(
    () => activeColumns?.map((column) => accessFunc(column)) ?? [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeColumns],
  );

  useEffect(() => {
    if (visibleColumns) {
      addColumns(visibleColumns);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleColumns]);
  return activeColumns || [];
};

export default useColumns;
