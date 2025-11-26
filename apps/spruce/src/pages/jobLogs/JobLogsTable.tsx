import { useMemo } from "react";
import { Link } from "@leafygreen-ui/typography";
import TestStatusBadge from "@evg-ui/lib/components/Badge/TestStatusBadge";
import {
  TablePlaceholder,
  LGColumnDef,
  useLeafyGreenTable,
  BaseTable,
} from "@evg-ui/lib/components/Table";
import { useJobLogsAnalytics } from "analytics/joblogs/useJobLogsAnalytics";
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

  const logkeeperColumns: LGColumnDef<LogkeeperTestResult>[] = useMemo(
    () => [
      {
        header: "Test Name",
        accessorKey: "name",
        cell: ({ getValue, row }) => (
          <Link
            hideExternalIcon
            href={getParsleyLogkeeperTestLogURL(buildId ?? "", row.original.id)}
            onClick={() => {
              sendEvent({
                name: "Clicked Parsley test log link",
                "build.id": buildId,
              });
            }}
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
            hideExternalIcon
            href={row.original?.logs?.urlParsley}
            onClick={() => {
              sendEvent({
                name: "Clicked Parsley test log link",
              });
            }}
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
  });
  return (
    <BaseTable
      emptyComponent={
        <TablePlaceholder message="No logs found for this job." />
      }
      loading={loading}
      shouldAlternateRowColor
      table={table}
    />
  );
};
