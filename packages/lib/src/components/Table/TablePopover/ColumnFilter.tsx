import type { Column } from "@tanstack/table-core";
import { conditionalToArray } from "../../../utils/array";
import "../types";
import TableFilterPopover from "./TableFilterPopover";
import TableSearchPopover from "./TableSearchPopover";

interface ColumnFilterProps<T> {
  column: Column<T, unknown>;
  onFilter?: () => void;
}

export const ColumnFilter = <T,>({
  column,
  onFilter,
}: ColumnFilterProps<T>) => {
  if (!column.getCanFilter()) {
    return null;
  }

  const { meta } = column.columnDef;
  const onConfirm = (value: string | string[]) => {
    column.setFilterValue(value);
    onFilter?.();
  };

  return meta?.treeSelect ? (
    <TableFilterPopover
      data-testid={meta.treeSelect["data-testid"]}
      onConfirm={onConfirm}
      options={
        meta.treeSelect.filterOptions
          ? meta.treeSelect.options.filter(
              ({ value }) => !!column.getFacetedUniqueValues().get(value),
            )
          : meta.treeSelect.options
      }
      value={
        conditionalToArray(column.getFilterValue() ?? [], true) as string[]
      }
    />
  ) : (
    <TableSearchPopover
      data-testid={meta?.search?.["data-testid"]}
      onConfirm={onConfirm}
      placeholder={meta?.search?.placeholder}
      value={(column.getFilterValue() as string) ?? ""}
    />
  );
};
