import { ForwardedRef, forwardRef, Fragment } from "react";
import { SerializedStyles } from "@emotion/react";
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
  type LGRowData,
  ExpandedContentProps,
} from "@leafygreen-ui/table";
import { tableColumnOffset, size } from "../../constants/tokens";
import { conditionalToArray } from "../../utils/array";
import { TreeDataEntry } from "../TreeSelect";
import TableLoader from "./TableLoader";
import TableFilterPopover from "./TablePopover/TableFilterPopover";
import TableSearchPopover from "./TablePopover/TableSearchPopover";

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
  /** rows that will have a disabled style */
  disabledRowIndexes?: number[];
  /** whether the table is paginated */
  usePagination?: boolean;
  /** Object returned from the useLeafyGreenTable or useLeafyGreenVirtualTable hook */
  table: LeafyGreenVirtualTable<T> | LeafyGreenTable<T>;
  /** CSS to apply to the table rows */
  rowCss?: SerializedStyles;
}

type BaseTableProps<T> = SpruceTableProps<T> & Omit<TableProps<T>, "table">;

export const BaseTable = forwardRef<HTMLDivElement, BaseTableProps<any>>(
  <T extends LGRowData>(
    {
      "data-cy-row": dataCyRow,
      "data-cy-table": dataCyTable,
      disabledRowIndexes = [],
      emptyComponent,
      loading,
      loadingRows = 5,
      numTotalItems,
      rowCss,
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
          data-cy={dataCyTable}
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
                numColumns={table.getAllColumns().length}
                numRows={loadingRows}
              />
            )}

            {hasVirtualRows
              ? virtualRows.map((vr) => {
                  const { row } = vr;
                  return (
                    <RenderableRow
                      key={row.id}
                      dataCyRow={dataCyRow}
                      disabled={disabledRowIndexes?.includes(row.index)}
                      isSelected={selectedRowIndexes.includes(row.index)}
                      row={row}
                      rowCss={rowCss}
                      virtualRow={vr}
                    />
                  );
                })
              : rows.map((row) => (
                  <RenderableRow
                    key={row.id}
                    dataCyRow={dataCyRow}
                    disabled={disabledRowIndexes?.includes(row.index)}
                    isSelected={selectedRowIndexes.includes(row.index)}
                    row={row}
                    rowCss={rowCss}
                  />
                ))}
          </TableBody>
        </Table>
        {!loading &&
          rows.length === 0 &&
          (emptyComponent || (
            <DefaultEmptyMessage>No data to display</DefaultEmptyMessage>
          ))}
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
            value={
              conditionalToArray(
                header?.column?.getFilterValue() ?? [],
                true,
              ) as string[]
            }
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

const cellPaddingStyle = {
  paddingBottom: size.xxs,
  paddingTop: size.xxs,
};

const cellStyle = css`
  /* Force the nested div wrapping the cell content to take up full width. */
  > div > div > div {
    width: 100%;
  }
`;

const RenderableRow = <T extends LGRowData>({
  dataCyRow = "leafygreen-table-row",
  disabled = false,
  isSelected = false,
  row,
  rowCss,
  virtualRow,
}: {
  dataCyRow?: string;
  row: LeafyGreenTableRow<T>;
  virtualRow?: VirtualItem;
  isSelected?: boolean;
  disabled?: boolean;
  rowCss?: SerializedStyles;
}) => (
  <Fragment key={row.id}>
    {!row.isExpandedContent && (
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore: This is a workaround to fix the type error
      <Row
        className={css`
          ${rowCss}
          ${isSelected &&
          `
           background-color: ${blue.light3} !important;
           font-weight:bold;
           `}
        `}
        data-cy={dataCyRow}
        data-index={row.index}
        data-selected={isSelected}
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
            className={cellStyle}
            style={cellPaddingStyle}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </Cell>
        ))}
      </Row>
    )}
    {row.isExpandedContent && (
      <StyledExpandedContent row={row as LeafyGreenTableRow<unknown>} />
    )}
  </Fragment>
);

const DefaultEmptyMessage = styled.div`
  margin-top: ${size.s};
  margin-left: ${tableColumnOffset};
`;

const StyledExpandedContent = styled(
  ExpandedContent as React.ComponentType<ExpandedContentProps<LGRowData>>,
)`
  > td {
    padding: ${size.xs} 0;
    background-color: ${gray.light3};
  }
`;

const StyledPagination = styled(Pagination)`
  margin-top: ${size.xs};
`;
