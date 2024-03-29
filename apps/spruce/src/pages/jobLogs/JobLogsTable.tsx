import { useMemo, useRef } from "react";
import { LGColumnDef, useLeafyGreenTable } from "@leafygreen-ui/table";
import { Link } from "@leafygreen-ui/typography";
import { useJobLogsAnalytics } from "analytics/joblogs/useJobLogsAnalytics";
import { BaseTable } from "components/Table/BaseTable";
import { TablePlaceholder } from "components/Table/TablePlaceholder";
import {
  getParsleyLogkeeperTestLogURL,
  getParsleyTestLogURLForResmokeLogs,
} from "constants/externalResources";
import { JobLogsTableTestResult } from "./types";

interface JobLogsTableProps {
  buildId?: string;
  tests: JobLogsTableTestResult[];
  taskID: string;
  execution: number;
  isLogkeeper: boolean;
  loading: boolean;
}

export const JobLogsTable: React.FC<JobLogsTableProps> = ({
  buildId,
  execution,
  isLogkeeper,
  loading,
  taskID,
  tests,
}) => {
  const { sendEvent } = useJobLogsAnalytics();

  const tableContainerRef = useRef<HTMLDivElement>(null);

  const logkeeperColumns: LGColumnDef<JobLogsTableTestResult>[] = useMemo(
    () => [
      {
        header: "Test Name",
        accessorKey: "name",
        cell: ({ getValue, row }) => (
          <Link
            href={getParsleyLogkeeperTestLogURL(buildId, row.original.id)}
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

  const evergreenColumns: LGColumnDef<JobLogsTableTestResult>[] = useMemo(
    () => [
      {
        header: "Test Name",
        accessorKey: "testFile",
        cell: ({ getValue, row }) => (
          <Link
            href={getParsleyTestLogURLForResmokeLogs(
              taskID,
              execution,
              row.original.id,
              row.original.groupID,
            )}
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
    [sendEvent],
  );

  const table = useLeafyGreenTable<JobLogsTableTestResult>({
    columns: isLogkeeper ? logkeeperColumns : evergreenColumns,
    data: tests,
    containerRef: tableContainerRef,
  });
  return (
    <BaseTable
      table={table}
      shouldAlternateRowColor
      placeholder="No test results found."
      loading={loading}
      emptyComponent={
        <TablePlaceholder message="No logs found for this job." />
      }
    />
  );
};
