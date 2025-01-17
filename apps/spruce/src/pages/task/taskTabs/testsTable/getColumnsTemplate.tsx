import TestStatusBadge from "@evg-ui/lib/components/Badge/TestStatusBadge";
import { WordBreak } from "@evg-ui/lib/components/styles";
import { testStatusesFilterTreeData } from "constants/test";
import { TestSortCategory, TaskQuery } from "gql/generated/types";
import { string } from "utils";
import { LogsColumn } from "./LogsColumn";

const { msToDuration } = string;

interface GetColumnsTemplateParams {
  task: TaskQuery["task"];
}

export const getColumnsTemplate = ({ task }: GetColumnsTemplateParams) => [
  {
    header: "Name",
    accessorKey: "testFile",
    id: TestSortCategory.TestName,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    cell: ({ getValue }) => <WordBreak>{getValue()}</WordBreak>,
    enableColumnFilter: true,
    enableSorting: true,
    meta: {
      search: {
        "data-cy": "test-name-filter",
        placeholder: "Test name regex",
      },
      width: "50%",
    },
  },
  {
    header: "Status",
    accessorKey: "status",
    id: TestSortCategory.Status,
    enableColumnFilter: true,
    enableSorting: true,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    cell: ({ getValue }) => <TestStatusBadge status={getValue()} />,
    meta: {
      treeSelect: {
        "data-cy": "status-treeselect",
        options: testStatusesFilterTreeData,
      },
      width: "10%",
    },
  },
  {
    header: () =>
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      `${task.versionMetadata.isPatch ? "Base" : "Previous"} Status`,
    accessorKey: "baseStatus",
    id: TestSortCategory.BaseStatus,
    enableSorting: true,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    cell: ({ getValue }) => {
      const status = getValue();
      return status && <TestStatusBadge status={status} />;
    },
    meta: {
      width: "10%",
    },
  },
  {
    header: "Time",
    accessorKey: "duration",
    id: TestSortCategory.Duration,
    enableSorting: true,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    cell: ({ getValue }): string => {
      const ms = getValue() * 1000;
      return msToDuration(Math.trunc(ms));
    },
    meta: {
      width: "10%",
    },
  },
  {
    header: "Logs",
    sorter: false,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    cell: ({ row }) => <LogsColumn task={task} testResult={row.original} />,
    meta: {
      width: "20%",
    },
  },
];
