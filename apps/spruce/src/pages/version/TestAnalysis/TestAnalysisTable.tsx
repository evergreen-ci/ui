import { useRef, useMemo } from "react";
import Card from "@leafygreen-ui/card";
import { useLeafyGreenTable, LGColumnDef } from "@leafygreen-ui/table";
import TaskStatusBadge from "@evg-ui/lib/components/Badge/TaskStatusBadge";
import { BaseTable } from "components/Table/BaseTable";
import FailedTestGroupTable from "./FailedTestGroup/FailedTestGroupTable";
import { TaskBuildVariantField } from "./types";

interface TestAnalysisTableProps {
  tasks: [string, TaskBuildVariantField[]][];
}
type TableField = {
  testName: string;
  id: string;
};
const TestAnalysisTable: React.FC<TestAnalysisTableProps> = ({ tasks }) => {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const tableData = useMemo(
    () =>
      Object.entries(tasks).map(([, t]) => ({
        testName: t[0],
        statuses: countStatuses(t[1]),
        id: t[1][0].id,
        renderExpandedContent: () => (
          <Card>
            <FailedTestGroupTable tasks={t[1]} />
          </Card>
        ),
      })),
    [tasks],
  );

  const table = useLeafyGreenTable<TableField>({
    columns,
    containerRef: tableContainerRef,
    data: tableData,

    defaultColumn: {
      enableColumnFilter: false,
    },
  });
  return <BaseTable shouldAlternateRowColor table={table} />;
};

const columns: LGColumnDef<TableField>[] = [
  {
    header: "Test Name",
    accessorKey: "testName",
    cell: ({ getValue }) => getValue() as string,
    enableSorting: true,
  },
  {
    header: "Statuses",
    accessorKey: "statuses",
    cell: ({ getValue }) =>
      Object.entries(getValue() as Map<string, number>).map(
        ([status, count]) => (
          <TaskStatusBadge key={status} status={status} taskCount={count} />
        ),
      ),
  },
];

/**
 * `countStatuses` counts the number of tasks with each status
 * @param tasks - list of tasks
 * @returns - object with status as key and count as value
 */
const countStatuses = (tasks: TaskBuildVariantField[]) => {
  const statuses = tasks.reduce(
    (acc, task) => {
      const { status } = task;
      if (acc[status]) {
        acc[status] += 1;
      } else {
        acc[status] = 1;
      }
      return acc;
    },
    {} as Record<string, number>,
  );
  return statuses;
};

export default TestAnalysisTable;
