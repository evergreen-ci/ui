import { ForwardedRef, Fragment, forwardRef } from "react";
import { Pagination } from "@leafygreen-ui/pagination";
import {
  Cell,
  ExpandedContent,
  ExpandedContentProps,
  Header,
  HeaderCell,
  HeaderRow,
  type LGRowData,
  LGTableDataType,
  LeafyGreenTable,
  LeafyGreenTableRow,
  LeafyGreenVirtualTable,
  Row,
  Table,
  TableBody,
  TableHead,
  type TableProps,
  VirtualItem,
  flexRender,
} from "@leafygreen-ui/table";
import { cx } from "../../utils/css";
import styles from "./BaseTable.module.css";
import TableLoader from "./TableLoader";
import { ColumnFilter } from "./TablePopover/ColumnFilter";
import "./types";

interface SpruceTableProps<T extends LGRowData> {
  "data-testid-row"?: string;
  "data-testid-table"?: string;
  emptyComponent?: React.ReactNode;
  loading?: boolean;
  /** estimated number of rows the table will have */
  loadingRows?: number;
  /** number of total items the table will have */
  numTotalItems?: number;
  /** rows that will have a blue tint to represent that they are selected */
  selectedRowIndexes?: number[];
  /** rows that will have a disabled style */
  disabledRowIndexes?: number[];
  /** whether the table is paginated */
  usePagination?: boolean;
  /** Object returned from the useLeafyGreenTable or useLeafyGreenVirtualTable hook */
  table: LeafyGreenVirtualTable<T> | LeafyGreenTable<T>;
  /** Class name to apply to the table rows */
  rowClassName?: string;
}

type BaseTableProps<T extends LGRowData = LGRowData> = SpruceTableProps<T> &
  Omit<TableProps<T>, "table">;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const BaseTable = forwardRef<HTMLDivElement, BaseTableProps<any>>(
  <T extends LGRowData>(
    {
      "data-testid-row": dataTestIdRow,
      "data-testid-table": dataTestIdTable,
      disabledRowIndexes = [],
      emptyComponent,
      loading,
      loadingRows = 5,
      numTotalItems,
      rowClassName,
      selectedRowIndexes = [],
      table,
      usePagination = false,
      verticalAlignment = "middle",
      ...args
    }: BaseTableProps<T>,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const { rows } = table.getRowModel();

    const virtualRows = table.virtual?.getVirtualItems();
    const hasVirtualRows = virtualRows && virtualRows.length > 0;

    return (
      <>
        <Table
          ref={ref}
          data-testid={dataTestIdTable}
          table={table}
          verticalAlignment={verticalAlignment}
          {...args}
        >
          <TableHead isSticky={hasVirtualRows}>
            {table.getHeaderGroups().map((headerGroup) => (
              <HeaderRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHeaderCell
                    key={header.id}
                    header={header}
                    table={table}
                    usePagination={usePagination}
                  />
                ))}
              </HeaderRow>
            ))}
          </TableHead>
          <TableBody>
            {loading && (
              <TableLoader
                numColumns={table.getVisibleLeafColumns().length}
                numRows={loadingRows}
              />
            )}

            {hasVirtualRows
              ? virtualRows.map((vr) => {
                  const { row } = vr;
                  return (
                    <RenderableRow
                      key={row.id}
                      dataTestIdRow={dataTestIdRow}
                      disabled={disabledRowIndexes?.includes(row.index)}
                      isSelected={selectedRowIndexes.includes(row.index)}
                      row={row}
                      rowClassName={rowClassName}
                      virtualRow={vr}
                    />
                  );
                })
              : rows.map((row) => (
                  <RenderableRow
                    key={row.id}
                    dataTestIdRow={dataTestIdRow}
                    disabled={disabledRowIndexes?.includes(row.index)}
                    isSelected={selectedRowIndexes.includes(row.index)}
                    row={row}
                    rowClassName={rowClassName}
                  />
                ))}
          </TableBody>
        </Table>
        {!loading &&
          rows.length === 0 &&
          (emptyComponent || (
            <div className={styles.emptyMessage}>No data to display</div>
          ))}
        {usePagination && table && (
          <Pagination
            className={styles.pagination}
            currentPage={table.getState().pagination.pageIndex + 1}
            itemsPerPage={table.getState().pagination.pageSize}
            numTotalItems={numTotalItems}
            onBackArrowClick={() => table.previousPage()}
            onCurrentPageOptionChange={(value: string) => {
              table.setPageIndex(Number(value) - 1);
            }}
            onForwardArrowClick={() => table.nextPage()}
            onItemsPerPageOptionChange={(value: string) => {
              table.setPageSize(Number(value));
            }}
          />
        )}
      </>
    );
  },
);

BaseTable.displayName = "BaseTable";

const TableHeaderCell = <T extends LGRowData>({
  header,
  table,
  usePagination,
}: {
  header: Header<LGTableDataType<T>, unknown>;
  table: LeafyGreenVirtualTable<T> | LeafyGreenTable<T>;
  usePagination: boolean;
}) => {
  const { columnDef } = header.column ?? {};
  const { meta } = columnDef;
  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: This is a workaround to fix the type error
    <HeaderCell
      key={header.id}
      header={header}
      id={header.id}
      // @ts-expect-error: This is a workaround to fix the type error
      style={meta?.width && { width: meta.width }}
    >
      {flexRender(columnDef.header, header.getContext())}
      <ColumnFilter
        column={header.column}
        onFilter={usePagination ? () => table.firstPage() : undefined}
      />
    </HeaderCell>
  );
};

const RenderableRow = <T extends LGRowData>({
  dataTestIdRow = "leafygreen-table-row",
  disabled = false,
  isSelected = false,
  row,
  rowClassName,
  virtualRow,
}: {
  dataTestIdRow?: string;
  row: LeafyGreenTableRow<T>;
  virtualRow?: VirtualItem;
  isSelected?: boolean;
  disabled?: boolean;
  rowClassName?: string;
}) => (
  <Fragment key={row.id}>
    {!row.isExpandedContent && (
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore: This is a workaround to fix the type error
      <Row
        className={cx(rowClassName, isSelected && styles.selectedRow)}
        data-index={row.index}
        data-selected={isSelected}
        data-testid={dataTestIdRow}
        disabled={disabled}
        row={row}
        virtualRow={virtualRow}
      >
        {row.getVisibleCells().map((cell) => (
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore: This is a workaround to fix the type error
          <Cell
            key={cell.id}
            cell={cell}
            className={styles.cell}
            data-column={cell.column.id}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </Cell>
        ))}
      </Row>
    )}
    {row.isExpandedContent && (
      <TypedExpandedContent
        className={styles.expandedContent}
        row={row as LeafyGreenTableRow<unknown>}
      />
    )}
  </Fragment>
);

const TypedExpandedContent = ExpandedContent as React.ComponentType<
  ExpandedContentProps<LGRowData>
>;
