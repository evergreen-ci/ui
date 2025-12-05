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
  const logkeeperColumns: LGColumnDef<LogkeeperTestResult>[] = useMemo(
    () => getLogkeeperColumns(buildId),
    [buildId],
  );

  const evergreenColumns: LGColumnDef<EvergreenTestResult>[] = useMemo(
    () => getEvergreenColumns(),
    [],
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

const getLogkeeperColumns = (
  buildId: string | undefined,
): LGColumnDef<LogkeeperTestResult>[] => [
  {
    header: "Test Name",
    accessorKey: "name",
    cell: ({ getValue, row }) => (
      <ParsleyLink
        buildId={buildId}
        isLogkeeper
        parsleyUrl={getParsleyLogkeeperTestLogURL(
          buildId ?? "",
          row.original.id,
        )}
        testName={getValue() as string}
      />
    ),
    enableColumnFilter: false,
    enableSorting: false,
  },
];

const getEvergreenColumns = (): LGColumnDef<EvergreenTestResult>[] => [
  {
    header: "Test Name",
    accessorKey: "testFile",
    cell: ({ getValue, row }) => (
      <ParsleyLink
        isLogkeeper={false}
        parsleyUrl={row.original?.logs?.urlParsley ?? ""}
        testName={getValue() as string}
      />
    ),
    enableColumnFilter: false,
    enableSorting: false,
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ getValue }) => <TestStatusBadge status={getValue() as string} />,
    enableColumnFilter: false,
    enableSorting: false,
  },
];

export const ParsleyLink = ({
  buildId,
  isLogkeeper,
  parsleyUrl,
  testName,
}: {
  isLogkeeper: boolean;
  parsleyUrl: string;
  testName: string;
  buildId?: string;
}) => {
  const { sendEvent } = useJobLogsAnalytics(isLogkeeper);
  return (
    <Link
      hideExternalIcon
      href={parsleyUrl}
      onClick={() => {
        if (buildId) {
          sendEvent({
            name: "Clicked Parsley test log link",
            "build.id": buildId,
          });
        } else {
          sendEvent({
            name: "Clicked Parsley test log link",
          });
        }
      }}
    >
      {testName}
    </Link>
  );
};
