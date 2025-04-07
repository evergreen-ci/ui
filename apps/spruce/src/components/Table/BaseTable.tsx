import { ForwardedRef, forwardRef, Fragment } from "react";
import styled from "@emotion/styled";
import { css } from "@leafygreen-ui/emotion";
import Pagination from "@leafygreen-ui/pagination";
import { palette } from "@leafygreen-ui/palette";
import {
  Cell,
  ExpandedContent,
  flexRender,
  HeaderCell,
  HeaderRow,
  type LGRowData,
  Row,
  type RowData,
  Table,
  TableBody,
  type TableProps,
  TableHead,
  VirtualItem,
  LeafyGreenTableRow,
  LeafyGreenTable,
  LeafyGreenVirtualTable,
  Header,
  LGTableDataType,
} from "@leafygreen-ui/table";
import { size } from "@evg-ui/lib/constants/tokens";
import {
  TableFilterPopover,
  TableSearchPopover,
} from "components/TablePopover";
import { TreeDataEntry } from "components/TreeSelect";
import { tableColumnOffset } from "constants/tokens";
import TableLoader from "./TableLoader";

const { gray } = palette;

// Define typing of columns' meta field
// https://tanstack.com/table/v8/docs/api/core/column-def#meta
declare module "@tanstack/table-core" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    search?: {
      "data-cy"?: string;
      placeholder?: string;
    };
    treeSelect?: {
      "data-cy"?: string;
      // Configures whether or not the tree select should be filtered to only represent values found in the table.
      // Note that this may not be very performant for large tables.
      filterOptions?: boolean;
      options: TreeDataEntry[];
    };
    // Overcome react-table's column width limitations
    // https://github.com/TanStack/table/discussions/4179#discussioncomment-3334470
    width?: string;
  }
}

const { blue } = palette;

interface SpruceTableProps<T extends LGRowData> {
  "data-cy-row"?: string;
  "data-cy-table"?: string;
  emptyComponent?: React.ReactNode;
  loading?: boolean;
  /** estimated number of rows the table will have */
  loadingRows?: number;
  /** number of total items the table will have */
  numTotalItems?: number;
  /** rows that will have a blue tint to represent that they are selected */
  selectedRowIndexes?: number[];
  usePagination?: boolean;
  /** Object returned from the useLeafyGreenTable or useLeafyGreenVirtualTable hook */
  table: LeafyGreenVirtualTable<T> | LeafyGreenTable<T>;
}

type BaseTableProps<T> = SpruceTableProps<T> & Omit<TableProps<T>, "table">;

export const BaseTable = forwardRef<HTMLDivElement, BaseTableProps<any>>(
  <T extends LGRowData>(
    {
      "data-cy-row": dataCyRow,
      "data-cy-table": dataCyTable,
      emptyComponent,
      loading,
      loadingRows = 5,
      numTotalItems,
      selectedRowIndexes = [],
      table,
      usePagination = false,
      ...args
    }: BaseTableProps<T>,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const { rows } = table.getRowModel();

    const virtualRows = table.virtual?.getVirtualItems();
    const hasVirtualRows = virtualRows && virtualRows.length > 0;

    return (
      <>
        <Table ref={ref} data-cy={dataCyTable} table={table} {...args}>
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
                numColumns={table.getAllColumns().length}
                numRows={loadingRows}
              />
            )}
            {!loading &&
              rows.length === 0 &&
              (emptyComponent || (
                <DefaultEmptyMessage>No data to display</DefaultEmptyMessage>
              ))}
            {hasVirtualRows
              ? virtualRows.map((vr) => {
                  const { row } = vr;
                  return (
                    <RenderableRow
                      key={row.id}
                      dataCyRow={dataCyRow}
                      isSelected={selectedRowIndexes.includes(row.index)}
                      row={row}
                      virtualRow={vr}
                    />
                  );
                })
              : rows.map((row) => (
                  <RenderableRow
                    key={row.id}
                    dataCyRow={dataCyRow}
                    isSelected={selectedRowIndexes.includes(row.index)}
                    row={row}
                  />
                ))}
          </TableBody>
        </Table>
        {usePagination && table && (
          <StyledPagination
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

const cellPaddingStyle = { paddingBottom: size.xxs, paddingTop: size.xxs };

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
    <HeaderCell
      key={header.id}
      header={header}
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      style={meta?.width && { width: columnDef?.meta?.width }}
    >
      {flexRender(columnDef.header, header.getContext())}
      {header.column.getCanFilter() &&
        (meta?.treeSelect ? (
          <TableFilterPopover
            data-cy={meta.treeSelect?.["data-cy"]}
            onConfirm={(value) => {
              header.column.setFilterValue(value);
              if (usePagination) {
                table.firstPage();
              }
            }}
            options={
              meta.treeSelect?.filterOptions
                ? meta.treeSelect.options.filter(
                    ({ value }) =>
                      !!header.column.getFacetedUniqueValues().get(value),
                  )
                : meta.treeSelect.options
            }
            value={(header?.column?.getFilterValue() as string[]) ?? []}
          />
        ) : (
          <TableSearchPopover
            data-cy={meta?.search?.["data-cy"]}
            onConfirm={(value) => {
              header.column.setFilterValue(value);
              if (usePagination) {
                table.firstPage();
              }
            }}
            placeholder={meta?.search?.placeholder}
            value={(header?.column?.getFilterValue() as string) ?? ""}
          />
        ))}
    </HeaderCell>
  );
};

const RenderableRow = <T extends LGRowData>({
  dataCyRow = "leafygreen-table-row",
  isSelected = false,
  row,
  virtualRow,
}: {
  dataCyRow?: string;
  row: LeafyGreenTableRow<T>;
  virtualRow?: VirtualItem;
  isSelected?: boolean;
}) => (
  <Fragment key={row.id}>
    {!row.isExpandedContent && (
      <Row
        className={css`
          ${isSelected &&
          `
           background-color: ${blue.light3} !important;
           font-weight:bold;
           `}
        `}
        data-cy={dataCyRow}
        data-selected={isSelected}
        row={row}
        virtualRow={virtualRow}
      >
        {row.getVisibleCells().map((cell) => (
          <Cell key={cell.id} cell={cell} style={cellPaddingStyle}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </Cell>
        ))}
      </Row>
    )}
    {row.isExpandedContent && <StyledExpandedContent row={row} />}
  </Fragment>
);

const DefaultEmptyMessage = styled.div`
  margin-top: ${size.s};
  margin-left: ${tableColumnOffset};
`;

// @ts-expect-error: styled is not directly compatible with LeafyGreen's definition of ExpandedContent.
const StyledExpandedContent = styled(ExpandedContent)`
  > td {
    padding: ${size.xs} 0;
    background-color: ${gray.light3};
  }
` as typeof ExpandedContent;

// @ts-expect-error: styled is not directly compatible with LeafyGreen's definition of Pagination.
const StyledPagination = styled(Pagination)`
  margin-top: ${size.xs};
`;
