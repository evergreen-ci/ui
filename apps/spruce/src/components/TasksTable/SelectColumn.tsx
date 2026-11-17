import { Checkbox } from "@leafygreen-ui/checkbox";
import { LGColumnDef } from "@evg-ui/lib/components/Table";
import { TaskTableInfo } from "components/TasksTable/types";

interface SelectColumnOptions {
  allSelected: boolean;
  isRowSelected: (taskId: string) => boolean;
  onToggleAll: () => void;
  onToggleRow: (taskId: string) => void;
  someSelected: boolean;
}

export const getSelectColumn = ({
  allSelected,
  isRowSelected,
  onToggleAll,
  onToggleRow,
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
        checked={isRowSelected(row.id)}
        data-testid="select-row"
        onChange={() => onToggleRow(row.id)}
      />
    ) : null,
});
