import { ForwardedRef, forwardRef } from "react";
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
} from "@leafygreen-ui/table";
import {
  TableFilterPopover,
  TableSearchPopover,
} from "components/TablePopover";
import { TreeDataEntry } from "components/TreeSelect";
import { size, tableColumnOffset } from "constants/tokens";
import TableLoader from "./TableLoader";

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

type SpruceTableProps = {
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
};

export const BaseTable = forwardRef(
  (
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
    }: SpruceTableProps & TableProps<any>,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    const { virtualRows } = table;
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    const { rows } = table.getRowModel();
    const hasVirtualRows = virtualRows && virtualRows.length > 0;
    return (
      <>
        <StyledTable ref={ref} data-cy={dataCyTable} table={table} {...args}>
          <TableHead isSticky={hasVirtualRows}>
            {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
            {table.getHeaderGroups().map((headerGroup) => (
              <HeaderRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
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
                              if (usePagination && table) {
                                table.firstPage();
                              }
                            }}
                            options={
                              meta.treeSelect?.filterOptions
                                ? meta.treeSelect.options.filter(
                                    ({ value }) =>
                                      !!header.column
                                        .getFacetedUniqueValues()
                                        .get(value),
                                  )
                                : meta.treeSelect.options
                            }
                            value={
                              (header?.column?.getFilterValue() as string[]) ??
                              []
                            }
                          />
                        ) : (
                          <TableSearchPopover
                            data-cy={meta?.search?.["data-cy"]}
                            onConfirm={(value) => {
                              header.column.setFilterValue(value);
                              if (usePagination && table) {
                                table.firstPage();
                              }
                            }}
                            placeholder={meta?.search?.placeholder}
                            value={
                              (header?.column?.getFilterValue() as string) ?? ""
                            }
                          />
                        ))}
                    </HeaderCell>
                  );
                })}
              </HeaderRow>
            ))}
          </TableHead>
          <TableBody>
            {loading && (
              <TableLoader
                // @ts-expect-error: FIXME. This comment was added by an automated script.
                numColumns={table.getAllColumns().length}
                numRows={loadingRows}
              />
            )}
            {hasVirtualRows
              ? // @ts-expect-error: FIXME. This comment was added by an automated script.
                virtualRows.map((vr) => {
                  const row = rows[vr.index];
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
                    // @ts-expect-error: FIXME. This comment was added by an automated script.
                    virtualRow={null}
                  />
                ))}
          </TableBody>
        </StyledTable>
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

const cellPaddingStyle = { paddingBottom: size.xxs, paddingTop: size.xxs };

const RenderableRow = <T extends LGRowData>({
  dataCyRow = "leafygreen-table-row",
  isSelected = false,
  row,
  virtualRow,
}: {
  dataCyRow?: string;
  row: LeafyGreenTableRow<T>;
  virtualRow: VirtualItem;
  isSelected?: boolean;
}) => (
  <Row
    className={css`
      &[aria-hidden="false"] td > div {
        max-height: unset;
      }
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
      <Cell key={cell.id} style={cellPaddingStyle}>
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </Cell>
    ))}
    {row.original.renderExpandedContent && <StyledExpandedContent row={row} />}
    {row.subRows &&
      row.subRows.map((subRow) => (
        <Row
          key={subRow.id}
          className={css`
            &[aria-hidden="false"] td > div[data-state="entered"] {
              max-height: unset;
            }
          `}
          row={subRow}
          virtualRow={virtualRow}
        >
          {subRow.getVisibleCells().map((cell) => (
            <Cell key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </Cell>
          ))}
        </Row>
      ))}
  </Row>
);

const StyledTable = styled(Table)`
  transition: none !important;
`;

const DefaultEmptyMessage = styled.span`
  margin-left: ${tableColumnOffset};
`;

const StyledExpandedContent = styled(ExpandedContent)`
  // Allow expanded content containers to take up the full table width
  [data-state="entered"] > div {
    flex-grow: 1;
  }
` as typeof ExpandedContent;

// @ts-expect-error
const StyledPagination = styled(Pagination)`
  margin-top: ${size.xs};
`;
