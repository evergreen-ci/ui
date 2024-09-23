import { useRef } from "react";
import Button from "@leafygreen-ui/button";
import { useLeafyGreenTable, LGColumnDef } from "@leafygreen-ui/table";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { StyledRouterLink } from "components/styles";
import { BaseTable } from "components/Table/BaseTable";
import TaskStatusBadge from "components/TaskStatusBadge";
import { getTaskRoute } from "constants/routes";
import { TaskTab } from "types/task";
import { TaskBuildVariantField } from "../../types";

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
  return <BaseTable table={table} />;
};

const columns: LGColumnDef<TaskBuildVariantField>[] = [
  {
    header: "Task Name",
    accessorKey: "taskName",
    cell: ({ getValue, row }) => (
      <StyledRouterLink
        to={getTaskRoute(row.original.id, { tab: TaskTab.Tests })}
      >
        {getValue()}
      </StyledRouterLink>
    ),
    enableSorting: true,
  },
  {
    header: "Build Variant",
    accessorKey: "buildVariant",
    cell: ({ getValue }) => getValue() as string,
    enableSorting: true,
  },
  {
    header: "Failure Type",
    accessorKey: "status",
    cell: ({ getValue }) => (
      <TaskStatusBadge status={getValue() as TaskStatus} />
    ),
  },
  {
    header: "Logs",
    accessorKey: "id",
    cell: ({ row }) => (
      <Button
        data-cy="failed-test-group-parsley-btn"
        href={row.original.logs.urlParsley}
        target="_blank"
        title="High-powered log viewer"
      >
        Parsley
      </Button>
    ),
  },
];

export default FailedTestGroupTable;