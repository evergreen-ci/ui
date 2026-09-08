import { useMemo } from "react";
import {
  Cell,
  HeaderCell,
  HeaderRow,
  Link,
  Row,
  Skeleton,
  Table,
  TableBody,
  TableHead,
  TanStack,
  ViaColumnDef,
  useTable,
} from "@via-ds/components";
import TestStatusBadge from "@evg-ui/lib/components/Badge/TestStatusBadge";
import { TablePlaceholder } from "@evg-ui/lib/components/Table";
import { isValidHttpUrl } from "@evg-ui/lib/utils/url";
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
  const columns = useMemo<Array<ViaColumnDef<EvergreenTestResult>>>(
    () => getColumns(),
    [],
  );
  const table = useTable({ columns, data: tests });
  const { rows } = table.getRowModel();

  return (
    <>
      <Skeleton isLoading={loading}>
        <Table shouldAlternateRowColor table={table}>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <HeaderRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <HeaderCell key={header.id} header={header}>
                    {TanStack.flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </HeaderCell>
                ))}
              </HeaderRow>
            ))}
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <Row key={row.id} row={row}>
                {row.getVisibleCells().map((cell) => (
                  <Cell key={cell.id} cell={cell}>
                    {TanStack.flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext(),
                    )}
                  </Cell>
                ))}
              </Row>
            ))}
          </TableBody>
        </Table>
      </Skeleton>
      {!loading && rows.length === 0 && (
        <TablePlaceholder message="No logs found for this job." />
      )}
    </>
  );
};

const getColumns = (): Array<ViaColumnDef<EvergreenTestResult>> => [
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
  if (!isValidHttpUrl(parsleyUrl)) {
    return testName;
  }
  return (
    <Link
      href={parsleyUrl}
      linkStyle="internal"
      onPress={() => {
        sendEvent({
          name: "Clicked Parsley test log link",
        });
      }}
      rel="noopener noreferrer"
      target="_blank"
    >
      {testName}
    </Link>
  );
};
