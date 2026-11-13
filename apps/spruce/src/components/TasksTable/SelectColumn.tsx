import { Checkbox } from "@leafygreen-ui/checkbox";
import { LGColumnDef } from "@evg-ui/lib/components/Table";
import { TaskTableInfo } from "components/TasksTable/types";

interface SelectColumnOptions {
  allSelected: boolean;
  onToggleAll: () => void;
  someSelected: boolean;
}

export const getSelectColumn = ({
  allSelected,
  onToggleAll,
  someSelected,
}: SelectColumnOptions): LGColumnDef<TaskTableInfo> => ({
  id: "select",
  size: 40,
  enableSorting: false,
  enableColumnFilter: false,
  header: () => (
    <Checkbox
      aria-label="Select all tasks"
      checked={allSelected}
      data-testid="select-all-rows"
      indeterminate={someSelected && !allSelected}
      onChange={onToggleAll}
    />
  ),
  cell: ({ row }) =>
    row.getCanSelect() ? (
      <Checkbox
        aria-label={`Select task ${row.original.displayName}`}
        checked={row.getIsSelected()}
        data-testid="select-row"
        onChange={row.getToggleSelectedHandler()}
      />
    ) : null,
});
