import { createColumnHelper } from "@tanstack/react-table";
import { Body, Disclaimer } from "@via-ds/components/typography";
import { BaseTable, useLeafyGreenTable } from "@evg-ui/lib/components/Table";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { RevisionLink } from "components/RevisionLink";
import { getVersionRoute } from "constants/routes";
import { finishedTaskStatuses } from "constants/task";
import { ProjectCommitHistoryQuery } from "gql/generated/types";
import { useDateFormat } from "hooks";
import { numbers } from "utils";

const { roundDecimal, toPercent } = numbers;

type Version =
  ProjectCommitHistoryQuery["project"]["commits"]["versions"][number];

const columnHelper = createColumnHelper<Version>();

export const HistoryTable: React.FC<{
  versions: ProjectCommitHistoryQuery["project"]["commits"]["versions"];
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
  columnHelper.accessor("revision", {
    header: "Commit",
    cell: ({ getValue, row }) => (
      <RevisionLink
        revision={getValue()}
        to={getVersionRoute(row.original.id)}
      />
    ),
  }),
  columnHelper.accessor("user.displayName", {
    header: "Author",
  }),
  columnHelper.accessor("message", {
    header: "Message",
  }),
  columnHelper.accessor("createTime", {
    header: "Created",
    cell: ({ getValue }) => <CreatedCell date={getValue()} />,
  }),
  columnHelper.accessor(
    ({ taskStatusStats }) =>
      taskStatusStats?.counts?.reduce((acc, status) => status.count + acc, 0) ??
      0,
    {
      header: "Tasks Run",
      id: "run_count",
    },
  ),
  columnHelper.accessor(
    ({ taskStatusStats }) =>
      taskStatusStats?.counts?.reduce(
        (acc, status) =>
          (finishedTaskStatuses.some(
            (finishedStatus) => finishedStatus === status.status,
          )
            ? status.count
            : 0) + acc,
        0,
      ) ?? 0,
    {
      header: "Tasks Finished",
      id: "finish_count",
      cell: ({ getValue, row }) => {
        const finished = getValue();
        const total = row.getValue<number>("run_count");
        return <Percentage denominator={total} numerator={finished} />;
      },
    },
  ),
  columnHelper.accessor(
    ({ taskStatusStats }) =>
      taskStatusStats?.counts?.reduce(
        (acc, status) =>
          (status.status === TaskStatus.Succeeded ? status.count : 0) + acc,
        0,
      ) ?? 0,
    {
      header: "Tasks Succeeded",
      id: "success_count",
      cell: ({ getValue, row }) => {
        const succeeded = getValue();
        const finished = row.getValue<number>("finish_count");
        return <Percentage denominator={finished} numerator={succeeded} />;
      },
    },
  ),
];

const CreatedCell: React.FC<{ date: Date }> = ({ date }) => {
  const getDateCopy = useDateFormat();

  return <>{getDateCopy(date, { omitSeconds: true, omitTimezone: true })}</>;
};

const Percentage: React.FC<{ numerator: number; denominator: number }> = ({
  denominator,
  numerator,
}) => (
  <>
    <Body>{roundDecimal(toPercent(numerator / denominator), 2)}%</Body>
    <Disclaimer>
      ({numerator}/{denominator})
    </Disclaimer>
  </>
);
