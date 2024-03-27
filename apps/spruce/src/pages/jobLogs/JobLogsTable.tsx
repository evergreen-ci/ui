import { useMemo, useRef } from "react";
import { LGColumnDef, useLeafyGreenTable } from "@leafygreen-ui/table";
import { Link } from "@leafygreen-ui/typography";
import { useJobLogsAnalytics } from "analytics/joblogs/useJobLogsAnalytics";
import { BaseTable } from "components/Table/BaseTable";
import { getParsleyTestLogURL } from "constants/externalResources";

interface JobLogsTableTestResult {
  id: string;
  name: string;
}
interface JobLogsTableProps {
  buildId: string;
  tests: JobLogsTableTestResult[];
}

export const JobLogsTable: React.FC<JobLogsTableProps> = ({
  buildId,
  tests,
}) => {
  const { sendEvent } = useJobLogsAnalytics();

  const tableContainerRef = useRef<HTMLDivElement>(null);

  const columns: LGColumnDef<JobLogsTableTestResult>[] = useMemo(
    () => [
      {
        header: "Test Name",
        accessorKey: "name",
        cell: ({ getValue, row }) => (
          <Link
            href={getParsleyTestLogURL(buildId, row.original.id)}
            onClick={() => {
              sendEvent({
                name: "Clicked Parsley test log link",
                buildId,
              });
            }}
            hideExternalIcon
          >
            {getValue() as string}
          </Link>
        ),
        enableColumnFilter: false,
        enableSorting: false,
      },
    ],
    [buildId, sendEvent],
  );
  const table = useLeafyGreenTable<JobLogsTableTestResult>({
    columns,
    data: tests ?? [],
    containerRef: tableContainerRef,
  });
  return (
    <BaseTable
      table={table}
      shouldAlternateRowColor
      placeholder="No test results found."
    />
  );
};
