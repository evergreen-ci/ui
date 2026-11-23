import { ForwardedRef, forwardRef } from "react";
import { Pagination } from "@via-ds/components/pagination";
import { Skeleton } from "@via-ds/components/skeleton";
import {
  Cell,
  HeaderCell,
  HeaderRow,
  Row,
  Table,
  TableBody,
  TableHead,
  type TableProps,
  TanStack,
  TanStackVirtual,
  type ViaRowData,
  type ViaTable,
  type ViaTableRow,
  type ViaVirtualTable,
} from "@via-ds/components/table";
import { ColumnFilter } from "./TablePopover/ColumnFilter";
import "./types";
import styles from "./ViaBaseTable.module.css";

interface ViaBaseTableProps<T extends ViaRowData> extends Omit<
  TableProps<T>,
  "children" | "table"
> {
  "data-testid"?: string;
  disabledRowIndexes?: number[];
  emptyComponent?: React.ReactNode;
  loading?: boolean;
  loadingRows?: number;
  numTotalItems?: number;
  rowClassName?: string;
  table: ViaTable<T> | ViaVirtualTable<T>;
  usePagination?: boolean;
}

const ViaBaseTableInner = <T extends ViaRowData>(
  {
    disabledRowIndexes = [],
    emptyComponent,
    loading = false,
    loadingRows = 5,
    numTotalItems,
    rowClassName,
    table,
    usePagination = false,
    verticalAlignment = "middle",
    ...rest
  }: ViaBaseTableProps<T>,
  ref: ForwardedRef<HTMLDivElement>,
) => {
  const { rows } = table.getRowModel();
  const virtualRows = table.virtual?.getVirtualItems();
  const hasVirtualRows = !!virtualRows && virtualRows.length > 0;
  const { pageIndex, pageSize } = table.getState().pagination;

  const renderRow = (
    row: ViaTableRow<T>,
    virtualRow?: TanStackVirtual.VirtualItem,
  ) => (
    <Row
      key={row.id}
      className={rowClassName}
      disabled={disabledRowIndexes.includes(row.index)}
      row={row}
      virtualRow={virtualRow}
    >
      {row.getVisibleCells().map((cell) => (
        <Cell key={cell.id} cell={cell} data-column={cell.column.id}>
          {TanStack.flexRender(cell.column.columnDef.cell, cell.getContext())}
        </Cell>
      ))}
    </Row>
  );

  return (
    <>
      <Skeleton isLoading={loading}>
        <Table
          ref={ref}
          numSkeletonRows={loadingRows}
          table={table}
          verticalAlignment={verticalAlignment}
          {...rest}
        >
          <TableHead isSticky={hasVirtualRows}>
            {table.getHeaderGroups().map((headerGroup) => (
              <HeaderRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const width = header.column.columnDef.meta?.width;
                  return (
                    <HeaderCell
                      key={header.id}
                      header={header}
                      {...(width && { style: { width } })}
                    >
                      {TanStack.flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      <ColumnFilter
                        column={header.column}
                        onFilter={
                          usePagination ? () => table.firstPage() : undefined
                        }
                      />
                    </HeaderCell>
                  );
                })}
              </HeaderRow>
            ))}
          </TableHead>
          <TableBody>
            {hasVirtualRows
              ? virtualRows.map((vr) => renderRow(vr.row, vr))
              : rows.map((row) => renderRow(row))}
          </TableBody>
        </Table>
      </Skeleton>
      {!loading &&
        rows.length === 0 &&
        (emptyComponent ?? (
          <div className={styles.emptyMessage}>No data to display</div>
        ))}
      {usePagination && (
        <Pagination
          className={styles.pagination}
          onPageChange={(page) => table.setPageIndex(page - 1)}
          onPageSizeChange={(size) => table.setPageSize(size)}
          page={pageIndex + 1}
          pageSize={pageSize}
          totalItems={numTotalItems}
        />
      )}
    </>
  );
};

export const ViaBaseTable = forwardRef(ViaBaseTableInner) as <
  T extends ViaRowData,
>(
  props: ViaBaseTableProps<T> & { ref?: ForwardedRef<HTMLDivElement> },
) => React.ReactElement;
