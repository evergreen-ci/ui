import type { RowData } from "@tanstack/table-core";
import type { TreeDataEntry } from "../TreeSelect";

// Define typing of columns' meta field
// https://tanstack.com/table/v8/docs/api/core/column-def#meta
declare module "@tanstack/table-core" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    search?: {
      "data-testid"?: string;
      placeholder?: string;
    };
    treeSelect?: {
      "data-testid"?: string;
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
