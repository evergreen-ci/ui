import { useMemo, useRef } from "react";
import { LGColumnDef, useLeafyGreenTable } from "@leafygreen-ui/table";
import { Link } from "@leafygreen-ui/typography";
import { useJobLogsAnalytics } from "analytics/joblogs/useJobLogsAnalytics";
import { BaseTable } from "components/Table/BaseTable";
import { TablePlaceholder } from "components/Table/TablePlaceholder";
import TestStatusBadge from "components/TestStatusBadge";
import { getParsleyLogkeeperTestLogURL } from "constants/externalResources";
import {
  EvergreenTestResult,
  JobLogsTableTestResult,
  LogkeeperTestResult,
} from "./types";

interface JobLogsTableProps {
  buildId?: string;
  isLogkeeper: boolean;
  loading: boolean;
  tests: JobLogsTableTestResult[];
}

export const JobLogsTable: React.FC<JobLogsTableProps> = ({
  buildId,
  isLogkeeper,
  loading,
  tests,
}) => {
  const { sendEvent } = useJobLogsAnalytics(isLogkeeper);

  const tableContainerRef = useRef<HTMLDivElement>(null);

  const logkeeperColumns: LGColumnDef<LogkeeperTestResult>[] = useMemo(
    () => [
      {
        header: "Test Name",
        accessorKey: "name",
        cell: ({ getValue, row }) => (
          <Link
            // @ts-ignore: FIXME. This comment was added by an automated script.
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

  const evergreenColumns: LGColumnDef<EvergreenTestResult>[] = useMemo(
    () => [
      {
        header: "Test Name",
        accessorKey: "testFile",
        cell: ({ getValue, row }) => (
          <Link
            href={row.original?.logs?.urlParsley}
            onClick={() => {
              sendEvent({
                name: "Clicked Parsley test log link",
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
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ getValue }) => <TestStatusBadge status={getValue() as any} />,
        enableColumnFilter: false,
        enableSorting: false,
      },
    ],
    [sendEvent],
  );

  const table = useLeafyGreenTable<JobLogsTableTestResult>({
    columns: (isLogkeeper
      ? logkeeperColumns
      : evergreenColumns) as LGColumnDef<JobLogsTableTestResult>[],
    data: tests,
    containerRef: tableContainerRef,
  });
  return (
    <BaseTable
      table={table}
      shouldAlternateRowColor
      loading={loading}
      emptyComponent={
        <TablePlaceholder message="No logs found for this job." />
      }
    />
  );
};
