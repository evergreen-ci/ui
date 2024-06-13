import { useEffect, useMemo } from "react";
import { useQueryParam } from "hooks/useQueryParam";
import { HistoryQueryParams } from "types/history";
import { useHistoryTable } from "../HistoryTableContext";

const useColumns = <T>(allColumns: T[], accessFunc: (column: T) => string) => {
  const [selectedColumns] = useQueryParam<string[]>(
    HistoryQueryParams.VisibleColumns,
    [],
  );
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const { addColumns } = useHistoryTable();

  const activeColumns = useMemo(
    () =>
      selectedColumns.length
        ? allColumns?.filter((column) =>
            selectedColumns.includes(accessFunc(column)),
          )
        : allColumns,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedColumns, allColumns],
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
