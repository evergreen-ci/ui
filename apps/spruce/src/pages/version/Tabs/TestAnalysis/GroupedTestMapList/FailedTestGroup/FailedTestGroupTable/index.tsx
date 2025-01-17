import { useRef } from "react";
import Button from "@leafygreen-ui/button";
import { useLeafyGreenTable, LGColumnDef } from "@leafygreen-ui/table";
import TaskStatusBadge from "@evg-ui/lib/components/Badge/TaskStatusBadge";
import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { BaseTable } from "components/Table/BaseTable";
import { getTaskRoute } from "constants/routes";
import { TaskBuildVariantField } from "pages/version/Tabs/TestAnalysis/types";
import { TaskTab } from "types/task";

interface FailedTestGroupTableProps {
  tasks: TaskBuildVariantField[];
}
const FailedTestGroupTable: React.FC<FailedTestGroupTableProps> = ({
  tasks,
}) => {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const table = useLeafyGreenTable<TaskBuildVariantField>({
    columns,
    containerRef: tableContainerRef,
    data: tasks,
    defaultColumn: {
      enableColumnFilter: false,
    },
  });
  return <BaseTable data-cy="failed-test-grouped-table" table={table} />;
};

const columns: LGColumnDef<TaskBuildVariantField>[] = [
  {
    header: "Task Name",
    accessorKey: "taskName",
    cell: ({ getValue, row }) => (
      <StyledRouterLink
        to={getTaskRoute(row.original.id, { tab: TaskTab.Tests })}
      >
        {getValue() as string}
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
    cell: ({ getValue }) => (
      <TaskStatusBadge status={getValue() as TaskStatus} />
    ),
  },
  {
    header: "Logs",
    cell: ({ row }) => (
      <Button
        data-cy="failed-test-group-parsley-btn"
        href={row.original.logs.urlParsley}
        size="xsmall"
        target="_blank"
      >
        Parsley
      </Button>
    ),
  },
];

export default FailedTestGroupTable;
