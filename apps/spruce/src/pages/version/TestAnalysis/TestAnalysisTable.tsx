import { useRef, useMemo } from "react";
import Card from "@leafygreen-ui/card";
import { useLeafyGreenTable, LGColumnDef } from "@leafygreen-ui/table";
import { StyledRouterLink } from "components/styles";
import { BaseTable } from "components/Table/BaseTable";
import { getTaskRoute } from "constants/routes";
import { TaskTab } from "types/task";
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
  return <BaseTable table={table} />;
};

const columns: LGColumnDef<TableField>[] = [
  {
    header: "Test Name",
    accessorKey: "testName",
    cell: ({ getValue, row }) => (
      <StyledRouterLink
        to={getTaskRoute(row.original.id, { tab: TaskTab.Tests })}
      >
        {getValue()}
      </StyledRouterLink>
    ),
    enableSorting: true,
  },
];

export default TestAnalysisTable;
