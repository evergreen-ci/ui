import { LGColumnDef } from "@leafygreen-ui/table";
import { TestStatusBadge, WordBreak } from "@evg-ui/lib/components";
import { testStatusesFilterTreeData } from "constants/test";
import { TestSortCategory, TaskQuery, TestResult } from "gql/generated/types";
import { string } from "utils";
import { ActionMenu } from "./ActionMenu";
import { LogsColumn } from "./LogsColumn";

const { msToDuration } = string;

interface GetColumnsTemplateParams {
  task: NonNullable<TaskQuery["task"]>;
}

export const getColumnsTemplate = ({
  task,
}: GetColumnsTemplateParams): LGColumnDef<TestResult>[] => [
  {
    header: "Name",
    accessorKey: "testFile",
    id: TestSortCategory.TestName,
    cell: ({ getValue }) => <WordBreak>{getValue() as string}</WordBreak>,
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
    cell: ({ getValue }) => <TestStatusBadge status={getValue() as string} />,
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
      `${task.versionMetadata.isPatch ? "Base" : "Previous"} Status`,
    accessorKey: "baseStatus",
    id: TestSortCategory.BaseStatus,
    enableSorting: true,
    cell: ({ getValue }) => {
      const status = getValue() as string;
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
    cell: ({ getValue }): string => {
      const ms = (getValue() as number) * 1000;
      return msToDuration(Math.trunc(ms));
    },
    meta: {
      width: "10%",
    },
  },
  {
    header: "Logs",
    enableSorting: false,
    cell: ({ row }) => <LogsColumn task={task} testResult={row.original} />,
    meta: {
      width: "20%",
    },
  },
  {
    header: "Actions",
    id: "actions",
    enableSorting: false,
    cell: ({ row }) => <ActionMenu task={task} test={row.original} />,
    meta: {
      width: "10%",
    },
  },
];
