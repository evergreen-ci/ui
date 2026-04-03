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
import { EvergreenTestResult } from "./types";

interface JobLogsTableProps {
  loading: boolean;
  tests: EvergreenTestResult[];
}

export const JobLogsTable: React.FC<JobLogsTableProps> = ({
  loading,
  tests,
}) => {
  const columns: LGColumnDef<EvergreenTestResult>[] = useMemo(
    () => getColumns(),
    [],
  );

  const table = useLeafyGreenTable<EvergreenTestResult>({
    columns,
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

const getColumns = (): LGColumnDef<EvergreenTestResult>[] => [
  {
    header: "Test Name",
    accessorKey: "testFile",
    cell: ({ getValue, row }) => (
      <ParsleyLink
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

const ParsleyLink = ({
  parsleyUrl,
  testName,
}: {
  parsleyUrl: string;
  testName: string;
}) => {
  const { sendEvent } = useJobLogsAnalytics();
  return (
    <Link
      hideExternalIcon
      href={parsleyUrl}
      onClick={() => {
        sendEvent({
          name: "Clicked Parsley test log link",
        });
      }}
    >
      {testName}
    </Link>
  );
};
