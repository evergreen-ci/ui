import { useMemo } from "react";
import Button from "@leafygreen-ui/button";
import TaskStatusBadge from "@evg-ui/lib/components/Badge/TaskStatusBadge";
import { StyledRouterLink, WordBreak } from "@evg-ui/lib/components/styles";
import {
  useLeafyGreenTable,
  LGColumnDef,
  BaseTable,
} from "@evg-ui/lib/components/Table";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { getTaskRoute } from "constants/routes";
import { TaskBuildVariantField } from "pages/version/Tabs/TestAnalysis/types";
import { TaskTab } from "types/task";

interface FailedTestGroupTableProps {
  tasks: TaskBuildVariantField[];
}
const FailedTestGroupTable: React.FC<FailedTestGroupTableProps> = ({
  tasks,
}) => {
  const memoizedColumns = useMemo(() => getColumns(), []);

  const table = useLeafyGreenTable<TaskBuildVariantField>({
    columns: memoizedColumns,
    data: tasks,
    defaultColumn: {
      enableColumnFilter: false,
    },
  });
  return (
    <BaseTable
      data-cy="failed-test-grouped-table"
      shouldAlternateRowColor
      table={table}
    />
  );
};

const getColumns = (): LGColumnDef<TaskBuildVariantField>[] => [
  {
    header: "Task Name",
    accessorKey: "taskName",
    cell: ({ getValue, row }) => (
      <StyledRouterLink
        to={getTaskRoute(row.original.id, { tab: TaskTab.Tests })}
      >
        <WordBreak>{getValue() as string}</WordBreak>
      </StyledRouterLink>
    ),
    enableSorting: true,
  },
  {
    header: "Build Variant",
    accessorKey: "buildVariant",
    enableSorting: true,
  },
  {
    header: "Failure Type",
    accessorKey: "displayStatus",
    meta: { width: "15%" },
    cell: ({ getValue }) => (
      <TaskStatusBadge status={getValue() as TaskStatus} />
    ),
  },
  {
    header: "Logs",
    meta: { width: "10%" },
    cell: ({ row }) => (
      <Button
        data-cy="failed-test-group-parsley-btn"
        href={row.original.logs.urlParsley}
        size="xsmall"
      >
        Parsley
      </Button>
    ),
  },
];

export default FailedTestGroupTable;
