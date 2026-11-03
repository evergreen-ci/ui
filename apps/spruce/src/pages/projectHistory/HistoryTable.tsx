import { BaseTable, useLeafyGreenTable } from "@evg-ui/lib/components/Table";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { RevisionLink } from "components/RevisionLink";
import { getVersionRoute } from "constants/routes";
import { finishedTaskStatuses } from "constants/task";
import { ProjectCommitHistoryQuery } from "gql/generated/types";
import { numbers } from "utils";

const { roundDecimal, toPercent } = numbers;

export const HistoryTable: React.FC<{
  versions: ProjectCommitHistoryQuery["waterfall"]["versions"];
}> = ({ versions }) => {
  const table = useLeafyGreenTable({
    columns,
    data: versions,
    defaultColumn: {
      enableColumnFilter: false,
      enableSorting: false,
      // Handle bug in sorting order
      // https://github.com/TanStack/table/issues/4289
      sortDescFirst: false,
    },
    initialState: {
      columnVisibility: {
        run_count: false,
      },
    },
  });

  return (
    <BaseTable
      // data-loading={loading}
      data-testid="hosts-table"
      // loading={loading}
      // loadingRows={limit}
      shouldAlternateRowColor
      table={table}
    />
  );
};

const columns = [
  {
    header: "Commit",
    accessorKey: "revision",
    cell: ({ getValue, row }) => (
      <RevisionLink
        revision={getValue()}
        to={getVersionRoute(row.original.id)}
      />
    ),
  },
  {
    header: "Author",
    accessorKey: "user.displayName",
  },
  {
    header: "Message",
    accessorKey: "message",
  },
  {
    header: "Created",
    accessorKey: "createTime",
  },
  {
    header: "Tasks Run",
    id: "run_count",
    accessorFn: ({ taskStatusStats }) =>
      taskStatusStats.counts.reduce((acc, s) => s.count + acc, 0),
  },
  {
    header: "Tasks Finished",
    id: "finish_count",
    accessorFn: ({ taskStatusStats }) =>
      taskStatusStats.counts.reduce(
        (acc, s) =>
          (finishedTaskStatuses.includes(s.status) ? s.count : 0) + acc,
        0,
      ),
    cell: ({ getValue, row }) => {
      const finished = getValue();
      const total = row.getValue("run_count");
      return <Percentage denominator={total} numerator={finished} />;
    },
  },
  {
    header: "Tasks Succeeded",
    accessorFn: ({ taskStatusStats }) =>
      taskStatusStats.counts.reduce(
        (acc, s) => (s.status === TaskStatus.Succeeded ? s.count : 0) + acc,
        0,
      ),
    cell: ({ getValue, row }) => {
      const succeeded = getValue();
      const finished = row.getValue("finish_count");
      return <Percentage denominator={finished} numerator={succeeded} />;
    },
  },
];

const Percentage: React.FC<{ numerator: number; denominator: number }> = ({
  denominator,
  numerator,
}) => (
  <span>
    {roundDecimal(toPercent(numerator / denominator), 2)}% ({numerator}/
    {denominator})
  </span>
);
