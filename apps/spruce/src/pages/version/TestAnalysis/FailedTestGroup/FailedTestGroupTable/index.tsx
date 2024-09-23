import { useRef } from "react";
import { useLeafyGreenTable, LGColumnDef } from "@leafygreen-ui/table";
import { BaseTable } from "components/Table/BaseTable";
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
    header: "Task",
    accessorKey: "taskName",
    cell: ({ getValue }) => getValue() as string,
    enableSorting: true,
  },
  {
    header: "Build Variant",
    accessorKey: "buildVariant",
    cell: ({ getValue }) => getValue() as string,
  },
  {
    header: "Failure Type",
    accessorKey: "status",
    cell: ({ getValue }) => getValue() as string,
  },
  {
    header: "Logs",
    accessorKey: "id",
    cell: ({ getValue }) => {
      getValue();
    },
  },
];

export default FailedTestGroupTable;
